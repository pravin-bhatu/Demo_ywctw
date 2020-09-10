const express = require('express');
const router = express.Router();

const MarkdownIt = require('markdown-it');
const markdown = new MarkdownIt();
const _ = require('underscore');
const moment = require('moment');

const Course = require('../service/course');
const Lesson = require('../service/lesson');
const Money = require('../service/money');
const Media = require('../service/media');
const Enrollment = require('../service/enrollment');

const UserService = require('../services/user');
const CourseService = require('../services/course.js');
const DiscountService = require('../services/discounts.js');
const PartnerService = require('../services/partner.js');
const BooksService = require('../services/books.js');
const Parse = require('../modules/parse.js');
const analytics = require('../modules/analytics.js');

router.use(DiscountService.mwGetCourseDiscount);
router.use(DiscountService.mwGetUserDiscounts);
router.use(PartnerService.mwGetPartnerCode);

/* GET home page. */
router.get('/', [CourseService.mwGetCourses], (req, res) => {
  res.render('course/index', res.data);
});

router.post('/enroll', (req, res) => {
  // TODO: Redirect to the course page they were on.
  if (!req.body.courseId || !req.isAuthenticated()) return res.redirect('/');
  Course.Crud.read({
    id: req.body.courseId,
    include: ['instructor'],
  }, (error, course) => {
    // DB For Enrollment tracking here
    const enrollmentTrackingData = {
      
    }
    // analytics.track({
    //   userId: user.id,
    //   event: 'User Enrolled in Course',
    //   properties: {
    //     authId: req.user._json.user_id,
    //     affiliateId: user.get('referredBy') ? user.get('referredBy').id : null,
    //     courseId: course.id,
    //     coursePrice: course.get('price'),
    //   },
    // });
    // Enroll in Free Course
    if (!error && course.get('price') === 0) {
      // SEND RECEIPT FOR FREE COURSE
      Money.Receipt.send({
        email: req.user._json.email,
        course: course.get('name'),
        instructor: course.get('instructor').get('name'),
        price: 0,
        discount: 0,
        total: 0,
        date: moment().format('MMMM Do YYYY, h:mm a'),
      });

      Enrollment.Crud.create({
        userId: req.user._json.user_id,
        course: course,
      }, () => {
        const user = res.data.currentUser;
        analytics.track({
          userId: user.id,
          event: 'User Enrolled in Course',
          properties: {
            authId: req.user._json.user_id,
            affiliateId: user.get('referredBy') ? user.get('referredBy').id : null,
            courseId: course.id,
            coursePrice: course.get('price'),
          },
        });
        return res.redirect('/courses/' + course.get('slug') + '/enrolled');
      });
    } else if (!error && req.body.payment_method_nonce) {
      let amount = course.get('price');
      if (res.data.user.membership) amount = Math.floor(course.get('price') * 0.5);
      if (res.data.user.firstDiscount) amount = Math.floor(course.get('price') * 0.25);
      if (res.data.discounts && res.data.discounts.length) {
        const product = 'course-' + course.id;
        res.data.courseDiscount = res.data.discounts.filter(discount => {
          return discount.get('discount').get('productType') === product;
        });
        if (res.data.courseDiscount.length === 1) {
          res.data.discounts = res.data.courseDiscount;
        }

        if (res.data.discounts[0].get('discount').get('static')) {
          amount = res.data.discounts[0].get('discount').get('amount');
        } else {
          amount = Math.floor(course.get('price') * res.data.discounts[0].get('discount').get('amount'));
        }
      }

      console.log('In checkout submitting payment!!');
      if (res.data.partnerCode) {
        if (res.data.partnerCode.get('static')) {
          amount = res.data.partnerCode.get('amount');
        } else {
          amount = Math.floor(course.get('price') * res.data.partnerCode.get('amount'));
        }
      }

      console.log('going to charge :: ' + amount);
      Money.Charge.create({
        amount: amount,
        nonce: req.body.payment_method_nonce,
        userId: req.user._json.user_id,
        courseId: course.id,
        instructor: course.get('instructor'),
        user: res.data.currentUser,
        userReferredBy: res.data.currentUser.get('referredBy'),
        partnerCode: res.data.partnerCode ? res.data.partnerCode.get('code') : '-',
      }).then((braintreeResults) => {
        console.log('Done!!!');
        console.log('Braintree Results :: ' + JSON.stringify(braintreeResults));
        // SEND RECEIPT FOR PAID COURSE
        Money.Receipt.send({
          email: req.user._json.email,
          course: course.get('name'),
          instructor: course.get('instructor').get('name'),
          price: course.get('price'),
          discount: course.get('price') - amount,
          total: amount,
          date: moment().format('MMMM Do YYYY, h:mm a'),
        });
        Enrollment.Crud.create({
          userId: req.user._json.user_id,
          course: course,
        }, () => {
          function finish() {
            if (res.data.user.firstDiscount) {
              UserService.update(req.user._json.user_id, {firstDiscount: false}).then(() => {
                return res.redirect('/courses/' + course.get('slug') + '/enrolled');
              }).catch(() => {
                return res.redirect('/courses/' + course.get('slug') + '/enrolled');
              });
            } else {
              return res.redirect('/courses/' + course.get('slug') + '/enrolled');
            }
          }

          if (res.data.discounts && res.data.discounts.length) {
            res.data.discounts[0].increment('used');
            res.data.discounts[0].save().then(
              () => { finish(); },
              () => { finish(); }
            );
          } else {
            finish();
          }
        });
      }).catch((error) => {
        console.log('Braintree Error :: ' + JSON.stringify(error));
        return res.redirect('back');
      });
    } else {
      res.redirect('/courses');
    }
  });
});

/* GET Course page. */
router.get(
  '/:slug',
  [
    CourseService.mwGetBySlug,
    Media.Middleware.getForCourse,
    Enrollment.Middleware.enrolledIn,
    CourseService.mwAddLessonsToSections,
    BooksService.mwGetForInstructor,
  ],
  (req, res) => {

    if (res.data.courseDiscount) {
      if (res.data.courseDiscount.get('productType') === 'course-' + res.data.course.id) {
        res.data.discountCode = res.data.courseDiscount;
      }
    }


    if (res.data.discounts) {
      _.each(res.data.discounts, function(discount) {
        if(discount.get('discount').get('productType') === 'course-' + res.data.course.id) {
          res.data.discounts = res.data.discounts.filter(discount => {
            return discount.get('discount').get('productType') === 'course-' + res.data.course.id;
          });
        }
      });
    }

    if (res.data.partnerCode) {
      if (res.data.course.get('instructor').id === res.data.partnerCode.get('instructor').id) {
        res.data.partnerCode.valid = true;
      } else {
        res.data.partnerCode.valid = false;
      }
    }
    
    res.data.shareTEXT = res.data.course.get('instructor').get('name') + ' | ' + res.data.course.get('name');
    res.data.affiliateID = "SET-AFFILIATE-ID-IN-ROUTE"; 
    res.data.shareURL = req.protocol + '://' + req.get('host') + req.originalUrl + "?ref=" + res.data.affiliateID;    

    res.data.meta.title = res.data.course.get('instructor').get('name') + ' | ' + res.data.course.get('name');
    res.data.meta.og.title = res.data.course.get('name');
    res.data.meta.og.image = res.data.course.get('cardImage') ? res.data.course.get('cardImage').url() : res.data.meta.og.image;
    res.data.meta.og.description = res.data.course.get('description').substring(0, 250) + '...';
    res.data.libs.markdown = markdown;
    res.render('course/product', res.data);
  }
);

router.get(
  '/:slug/enrolled',
  [
    CourseService.mwGetBySlug,
    Media.Middleware.getForCourse,
    Enrollment.Middleware.enrolledIn,
    CourseService.mwMarkLessonsComplete,
    CourseService.mwMarkLessonsQuiz,
    CourseService.mwAddLessonsToSections,
    BooksService.mwGetForInstructor,
  ],
  (req, res) => {
    if (!res.data.enrollment) return res.redirect('/courses/' + res.data.course.get('slug'));
    res.data.meta.title = res.data.course.get('instructor').get('name') + ' | ' + res.data.course.get('name');
    res.data.meta.og.title = res.data.course.get('title');
    res.data.meta.og.image = res.data.course.get('cardImage') ? res.data.course.get('cardImage').url() : res.data.meta.og.image;
    res.data.libs.markdown = markdown;
    res.render('course/enrolled', res.data);
  }
);

router.get(
  '/:slug/exam',
  [
    CourseService.mwGetBySlug,
    Enrollment.Middleware.enrolledIn,
    CourseService.mwGetCourseExam,
  ],
  (req, res) => {
    res.render('course/exam', res.data);
  }
);

/* GET Lesson Page. */
router.get(
  '/:slug/:lesson',
  [
    Course.Middleware.getForLesson,
    Course.Middleware.getForInstructor,
    Enrollment.Middleware.enrolledIn,
    Enrollment.Middleware.checkEnrollment,
    Lesson.Middleware.getForLesson,
    Lesson.Middleware.markComplete,
  ],
  (req, res) => {
    let previousLesson = null;
    let nextLesson = null;

    console.log("Lessons Length :: " + res.data.course.get('lessons').length);
    // Get out previous/next
    for (let i = 0; i < res.data.course.get('lessons').length; i++) {
      if (res.data.course.get('lessons')[i].id === res.data.lesson.id) {
        if (i > 0) previousLesson = res.data.course.get('lessons')[i - 1];
        if (i + 1 < res.data.course.get('lessons').length) nextLesson = res.data.course.get('lessons')[i + 1];
      }
    }

    res.data.lesson.disableMarkCompleteButton = false;
    res.data.hideQuestions = false;
    res.data.hidePassedQuestions = true;
    res.data.hideWarningQuestions = true;
    res.data.retakeQuiz = false;
    res.data.warningQuestionsData = '';
    if (Array.isArray(res.data.lesson.get('quiz'))){
      if (Array.isArray(res.data.enrollment.get('progress'))) {
        const currentProgress = res.data.enrollment.get('progress').find(x => x.lesson === res.data.lesson.id);
        if (currentProgress && currentProgress.quiz) {
          if (currentProgress.quiz.score === currentProgress.quiz.questions) {
            res.data.hidePassedQuestions = false;
            res.data.retakeQuiz = true;
            res.data.hideQuiz = true;
          } else {
            res.data.hideWarningQuestions = false;
            res.data.warningQuestionsData = 'You got ' + currentProgress.quiz.score + ' out of ' + currentProgress.quiz.questions + ' correct';
          }
        } else {
          res.data.lesson.disableMarkCompleteButton = true;
        }
      } else {
        res.data.lesson.disableMarkCompleteButton = true;
      }
    }

    res.data.previous = previousLesson;
    res.data.next = nextLesson;

    // Filter out this course for the 'more courses' list.
    res.data.courses = res.data.courses.filter(course => {
      return course.id !== res.data.course.id;
    });

    res.data.libs.markdown = markdown;
    const ParseMedia = Parse.Object.extend('Media');
    const query = new Parse.Query(ParseMedia);
    query.equalTo('lesson', res.data.lesson);
    query.find().then(
      media => {
        res.data.media = media;
        res.render('course/lesson', res.data);
      },
      () => {
        res.render('course/lesson', res.data);
      }
    );
  }
);

router.get(
  '/complete/:course/:lesson', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('back');
    Course.Crud.read({id: req.params.course}, (error, course) => {
      Enrollment.Crud.read(
        {single: true, userId: req.user._json.user_id, course: course},
        (err, enrollment) => {
          const completed = enrollment.get('completed');
          completed.push(req.params.lesson);
          Enrollment.Crud.update(enrollment.id, {completed: completed}, () => {
            res.redirect('back');
          });
        });
    });
  }
);


router.post('/checkAnswers', (req, res) => {
  const userQuiz = req.body;
  const userAnswers = userQuiz.answers;
  const questionType = userQuiz.questionType;

  const courseQuery = new Parse.Query(Parse.Object.extend('Course'));
  const quizQuery = new Parse.Query(Parse.Object.extend('Question'));
  courseQuery.get(userQuiz.courseId).then(course => {
    quizQuery.equalTo('course', course)
    quizQuery.find().then(quizQuestions => {
      let correctCount = 0;
      for (let i = 0; i < userAnswers.length; i++) {
        const userAnswer = userAnswers[i];
        for (const key in userAnswer) {
          const currentQuestion = quizQuestions.find(x => x.id === key);
          if (currentQuestion.get('answers').correct === userAnswer[key]) {
            correctCount++;
          }
        }
      }

      const userResult = {'score': correctCount, 'questions': userAnswers.length};

      if (questionType === 'quiz') {
        let progress = [];
        Enrollment.Crud.read(
          {single: true, userId: req.user._json.user_id, course: course},
          (err, enrollment) => {
            let progressUpdated = false;
            if (Array.isArray(enrollment.get('progress'))) {
              progress = enrollment.get('progress');
              for (let i = 0; i < progress.length; i++) {
                if (progress[i].lesson === userQuiz.lessonId) {
                  progress[i].quiz = userResult;
                  progressUpdated = true;
                }
              }
            }

            if (!progressUpdated) {
              const newProgress = {};
              newProgress.lesson = userQuiz.lessonId;
              newProgress.quiz = userResult;
              progress.push(newProgress);
            }

            enrollment.set('progress', progress);
            enrollment.save().then( response => {
              res.send(userResult);
            });
          });
      } else if (questionType === 'exam') {
        Enrollment.Crud.read(
          {single: true, userId: req.user._json.user_id, course: course},
          (err, enrollment) => {
            enrollment.set('exam', userResult);
            enrollment.save().then( enrollment => {
              res.send(userResult);
            });
          });
      }
    });
  });
});

module.exports = router;
