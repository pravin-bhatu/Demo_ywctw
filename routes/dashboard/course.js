const express = require('express');
const router = express.Router();

const toMarkdown = require('to-markdown');
const MarkdownIt = require('markdown-it');
const markdown = new MarkdownIt();
const _ = require('underscore');

const DashboardService = require('../../services/dashboard/index.js');
const DashboardCourseService = require('../../services/dashboard/course.js');

router.get('/',
  [
    DashboardService.mwGetInstructor,
    DashboardCourseService.mwGetInstuctorCourses,
  ], (req, res) => {

    const devCourses = res.data.courses.filter(course => {
      return course.get('stage') === 'stage' || course.get('stage') === 'dev';
    });
    const prodCourses = res.data.courses.filter(course => {
      return course.get('stage') === 'prod';
    });

    res.data.prodCourses = prodCourses;
    res.data.devCourses = devCourses;

    res.render('dashboard/course/index', res.data);
  });


router.get('/add',
  [
    DashboardService.mwGetInstructor,
  ], (req, res) => {

    console.log('In course add');

    res.data.formType = 'Add';
    res.data.values = {};

    res.data.instructorId = res.data.instructor.id;
    res.render('dashboard/course/addCourse', res.data);

  });


router.post('/add',
  [
    DashboardService.mwGetInstructor,
  ], (req, res) => {

    const instructorId = res.data.instructor.id;
    const instructorName = res.data.instructor.get('name');
    const nameInitials = instructorName.match(/\b(\w)/g).join('').toLowerCase() + '-';

    // create slug from Course Name
    const courseSlug = nameInitials + req.body.courseName.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');

    const courseLanguage = ["English"]
    // TODO: Make Array from selection box for course language
    // const courseLanguage = req.body.courseLanuage.split(',');
    // console.log('courseLanguage: ' + courseLanguage);

    const markdownDescription = toMarkdown(req.body.courseDescription);
    const markdownPerfectFor = toMarkdown(req.body.coursePerfectFor);
    const markdownRequirements = toMarkdown(req.body.courseRequirements);
    const markdownOutcomes = toMarkdown(req.body.courseOutcomes);

    const lessons = [];
    const stage = 'dev';

    const courseData = {
      name: req.body.courseName,
      instructor: {"__type":"Pointer","className":"Instructor","objectId":instructorId},
      instructorName: instructorName,
      price: Number(req.body.coursePrice),
      skill: req.body.courseLevel,
      languages: courseLanguage,
      description: markdownDescription,
      coursePerfectFor: markdownPerfectFor,
      courseRequirements: markdownRequirements,
      courseOutcomes: markdownOutcomes,
      sections: ["Course"],
      lessons: lessons,
      features: ["Unlimited Access With VIP"],
      slug: courseSlug,
      stage: stage,
    }

    // console.log(courseData);

    const options = {
      type: req.body.formType,
    }
    console.log('courseData');
    console.log(courseData);

    DashboardCourseService.mwAddUpdateCourse(courseData, options, (e, courseId) => {
      if (e) {
        res.redirect('/dashboard/course/addLesson?courseId=' + courseId);
      } else {
        res.render('/dashboard/course/add', courseData);
      }

    });

});



router.get('/addLesson',
  [
    DashboardCourseService.mwGetCourseInfo,
  ], (req, res) => {

    const values = {};
    res.data.formType = 'Add';

    res.data.lessons = res.data.course.get('lessons');

    const lessonOrder = _.filter(res.data.course.get('lessons'), (lesson) => {
      return lesson.get('order') !== 0;
    });

    const lessonIntro = _.filter(res.data.course.get('lessons'), (lesson) => {
      return lesson.get('order') === 0;
    });

    values.order = 0;
    if ((lessonOrder.length || lessonIntro.length) !== 0) {
      values.order = Number(lessonOrder.length + 1);
    }

    res.data.values = values;
    res.data.courseId = req.query.courseId;

    res.render('dashboard/course/addLesson', res.data);
});

router.post('/addLesson', (req, res) => {

  let slug = req.body.name.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');

  const markdownDescription = toMarkdown(req.body.description);
  const markdownChallenge = toMarkdown(req.body.challenge);

  let lessonData = {
    sectionName: req.body.sectionName,
    name: req.body.name,
    order: Number(req.body.order),
    description: markdownDescription,
    challenge: markdownChallenge,
    slug: slug,
    course: {"__type":"Pointer","className":"Course","objectId":req.body.courseId},
  }

  const options = {
    type: req.body.formType,
    courseId: req.body.courseId,
    lessonId: req.body.lessonId || '',
  }

  DashboardCourseService.mwAddUpdateLesson(lessonData, options, (e, courseId) => {
    if (e) {
      DashboardCourseService.mwUpdateLessonOrder(courseId, (b) => {
        if (b) {
          if (req.body.formType === 'Add') {
            res.redirect('/dashboard/course/addLesson?courseId=' + courseId);
          } else {
            res.redirect('/dashboard/course/edit?courseId=' + courseId);
          }
        } else {
          res.render('/dashboard/course/addLesson?courseId=' + courseId, lessonData);
        }
      });
    } else {
      res.render('/dashboard/course/addLesson?courseId=' + courseId, lessonData);
    }
  });


});

router.get('/addSection',
  [
    DashboardCourseService.mwGetCourseInfo,
  ], (req, res) => {
    res.data.courseId = req.query.courseId;
    res.render('dashboard/course/addSection', res.data);
});

router.post('/addSection', (req,res) => {
  const sectionData = {
    sectionName: req.body.sectionName,
    courseId: req.body.courseId,
  }

  DashboardCourseService.mwAddSection(sectionData, (e, courseId) => {
    if (e) {
      res.redirect('/dashboard/course/addLesson?courseId=' + courseId);
    } else {
      res.render('/dashboard/course/addSection?courseId=' + courseId, sectionData);
    }
  });
});


router.get('/edit',
  [
    DashboardService.mwGetInstructor,
    DashboardCourseService.mwGetCourseInfo,
  ], (req, res) => {

    res.data.formType = 'Edit';
    res.data.courseId = req.query.courseId;

    const values = {};
    values.name = res.data.course.get('name');
    values.price = res.data.course.get('price');
    values.pitch = res.data.course.get('pitch');
    values.description = res.data.course.get('description');
    values.coursePerfectFor = res.data.course.get('coursePerfectFor');
    values.courseRequirements = res.data.course.get('courseRequirements');
    values.courseOutcomes = res.data.course.get('courseOutcomes');
    values.requirements = res.data.course.get('requirements');
    values.outcomes = res.data.course.get('outcomes');

    res.data.libs.markdown = markdown;
    res.data.values = values;

    res.data.instructorId = res.data.instructor.id;
    res.render('dashboard/course/addCourse', res.data);


});

router.post('/edit',
  [
    DashboardService.mwGetInstructor,
  ], (req, res) => {

  // Get Instructor
    const instructorId = res.data.instructor.id;
    const instructorName = res.data.instructor.get('name');
    const nameInitials = instructorName.match(/\b(\w)/g).join('').toLowerCase() + '-';

    let courseSlug = nameInitials + req.body.courseName.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');

    const markdownDescription = toMarkdown(req.body.courseDescription);
    const markdownPerfectFor = toMarkdown(req.body.coursePerfectFor);
    const markdownRequirements = toMarkdown(req.body.courseRequirements);
    const markdownOutcomes = toMarkdown(req.body.courseOutcomes);

    let courseData = {
      name: req.body.courseName,
      slug: courseSlug,
      price: Number(req.body.coursePrice),
      skill: req.body.courseLevel,
      description: markdownDescription,
      coursePerfectFor: markdownPerfectFor,
      courseRequirements: markdownRequirements,
      courseOutcomes: markdownOutcomes,
    }

    const options = {
      type: req.body.formType,
      courseId: req.body.courseId,
    }

    console.log(courseData);


    DashboardCourseService.mwAddUpdateCourse(courseData, options, (e, courseId) => {
      if (e) {
        res.redirect('/dashboard/course/edit?courseId=' + courseId);
      } else {
        res.render('/dashboard/course/add', courseData);
      }
    });

});

router.get('/editLesson',
  [
    DashboardCourseService.mwGetCourseInfo,
    DashboardCourseService.mwGetLessonInfo,
  ], (req, res) => {

    res.data.formType = 'Edit';


    const values = {};
    values.name = res.data.lesson.get('name');
    values.description = res.data.lesson.get('description');
    values.challenge = res.data.lesson.get('challenge');
    values.order = res.data.lesson.get('order');
    values.section = res.data.lesson.get('sectionName');

    res.data.values = values;
    res.data.courseId = req.query.courseId;
    res.data.lessonId = req.query.lessonId;

    res.data.libs.markdown = markdown;

    res.render('dashboard/course/addLesson', res.data);

});

// Lesson Quiz
router.get('/addQuizQuestion', (req, res) => {

  res.data.formType = 'Add';
  res.data.lessonId = req.query.lessonId;
  res.data.courseId = req.query.courseId;

  res.render('dashboard/course/addQuiz', res.data);

});

router.post('/addQuizQuestion', (req, res) => {

  const questionType = req.body.questionType;
  let correctAnswer;
  let options = {};
  if(questionType === 'tf') {
    correctAnswer = req.body.trueFalse;
    options = {"A":"True","B":"False"};
  } else {
    correctAnswer = req.body.multipleChoice;
    if(req.body.answerA !== '') {
      options.A = req.body.answerA;
    }
    if(req.body.answerB !== '') {
      options.B = req.body.answerB;
    }
    if(req.body.answerC !== '') {
      options.C = req.body.answerC;
    }
    if(req.body.answerD !== '') {
      options.D = req.body.answerD;
    }
    if(req.body.answerE !== '') {
      options.E = req.body.answerE;
    }
  }

  const question = {
    course: {"__type":"Pointer","className":"Course","objectId":req.body.courseId},
    lesson: {"__type":"Pointer","className":"Lesson","objectId":req.body.lessonId},
    text: req.body.question,
    answers: {
      "correct": correctAnswer,
      "options": options,
    }
  }

  const formOptions = {
    formType: req.body.formType,
    lessonId: req.body.lessonId,
    courseId: req.body.courseId
  }

  DashboardCourseService.mwAddUpdateQuestion(question, formOptions, (e) => {
    if (e) {
      res.redirect('/dashboard/course/editLesson?courseId=' + req.body.courseId + '&lessonId=' + req.body.lessonId);
    } else {
      res.redirect('/dashboard/course/editLesson?courseId=' + req.body.courseId + '&lessonId=' + req.body.lessonId);
    }
  });
});


module.exports = router;