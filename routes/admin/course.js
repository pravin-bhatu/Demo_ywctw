const express = require('express');
const router = express.Router();
const Parse = require('../../modules/parse.js');

const moment = require('moment');
const toMarkdown = require('to-markdown');
const MarkdownIt = require('markdown-it');
const markdown = new MarkdownIt();
const _ = require('underscore');

const formidable = require('express-formidable');
const FileReader = require('filereader');
const json2csv = require('json2csv');

const AdminService = require('../../services/admin/index.js');
const AdminInstructors = require('../../services/admin/instructors.js');
const AdminCourseService = require('../../services/admin/courses.js');
const AdminInstructorsService = require('../../services/admin/instructors.js');

const CourseModel = Parse.Object.extend('Course');
const MediaModel = Parse.Object.extend('Media');


router.use(AdminService.mwGetAdminUser);

// Course List
router.get('/',
  [
    // AdminInstructors.mwGetInstructors,
    AdminCourseService.mwGetCourses,
    // AdminCourseService.mwGetEnrollments,

  ], (req, res) => {

    console.log('Get Course List');

    // TODO: loop thru courses and add enrollment count to each course
    /*
    _.each(res.data.courses, course => {
      let enrollmentCount = 0
      _.each(res.data.enrollments, enrollment =>{
        if (enrollment.get('course').id === course.id) {
          enrollmentCount++;
        }
      });

      course.enrollmentCount = enrollmentCount;
    })
    */

    res.data.libs.moment = moment;
    res.render('admin/course/index', res.data);

});

// Course Info Page
router.get('/course-info',
  [
    AdminCourseService.mwGetCourseInfo,
    AdminCourseService.mwGetCourseEnrollmentCount,
  ], (req, res) => {

    res.data.libs.markdown = markdown;
    res.data.libs.moment = moment;
    res.render('admin/course/course-info', res.data);

  });


// Add New Course
router.get('/add',
  [
    AdminInstructorsService.mwGetInstructors,
  ], (req, res) => {

    res.data.formType = 'Add';
    res.data.values = {};
    res.data.libs.moment = moment;
    res.render('admin/course/addCourse', res.data);

  });


router.post('/add', (req, res) => {

  // Get Instructor
  let instructor  = req.body.instructor.split(',');
  const instructorId = instructor[0];
  const instructorName = instructor[1];
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

  AdminCourseService.mwAddUpdateCourse(courseData, options, (e, courseId) => {
    if (e) {
      res.redirect('/admin/course/addLesson?courseId=' + courseId);
    } else {
      res.render('/admin/course/add', courseData);
    }

  });

});

router.get('/edit',
  [
    AdminInstructorsService.mwGetInstructors,
    AdminCourseService.mwGetCourseInfo,
  ], (req, res) => {

    res.data.formType = 'Edit';
    res.data.courseId = req.query.courseId;

    const values = {};
    values.instructorName = res.data.course.get('instructor').get('name');
    values.name = res.data.course.get('name');
    values.headline = res.data.course.get('headline');
    values.price = res.data.course.get('price');
    values.pitch = res.data.course.get('pitch');
    values.description = res.data.course.get('description');
    values.coursePerfectFor = res.data.course.get('coursePerfectFor');
    values.courseRequirements = res.data.course.get('courseRequirements');
    values.courseOutcomes = res.data.course.get('courseOutcomes');
    values.requirements = res.data.course.get('requirements');
    values.outcomes = res.data.course.get('outcomes');
    values.stage = res.data.course.get('stage');
    values.videoId = res.data.course.get('videoId');
    values.videoProvider = res.data.course.get('videoProvider');

    res.data.libs.markdown = markdown;
    res.data.values = values;

    res.render('admin/course/addCourse', res.data);
});

router.post('/edit', (req, res) => {

  // Get Instructor
  const instructor  = req.body.instructor.split(',');
  const instructorId = instructor[0];
  const instructorName = instructor[1];
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

  console.log('Course Headline');
  console.log(req.body.courseHeadline);

  const courseData = {
    name: req.body.courseName,
    headline: req.body.courseHeadline,
    slug: courseSlug,
    price: Number(req.body.coursePrice),
    skill: req.body.courseLevel,
    description: markdownDescription,
    coursePerfectFor: markdownPerfectFor,
    courseRequirements: markdownRequirements,
    courseOutcomes: markdownOutcomes,
    stage: req.body.stage,
    videoProvider: req.body.videoProvider,
    videoId: req.body.videoId,
  }

  const options = {
    type: req.body.formType,
    courseId: req.body.courseId,
  }

  // console.log(courseData);

  AdminCourseService.mwAddUpdateCourse(courseData, options, (e, courseId) => {
    if (e) {
      res.redirect('/admin/course/course-info?courseId=' + courseId);
    } else {
      res.render('/admin/course/add', courseData);
    }
  });

});

// Lessons
router.get('/addLesson',
  [
    AdminCourseService.mwGetCourseInfo,
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
    res.render('admin/course/addLesson', res.data);

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
    videoProvider: req.body.videoProvider,
    videoId: req.body.videoId,
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

  AdminCourseService.mwAddUpdateLesson(lessonData, options, (e, courseId) => {
    if (e) {
      AdminCourseService.mwUpdateLessonOrder(courseId, (b) => {
        if (b) {
          if (req.body.formType === 'Add') {
            res.redirect('/admin/course/addLesson?courseId=' + courseId);
          } else {
            res.redirect('/admin/course/course-info?courseId=' + courseId);
          }
        } else {
          res.render('/admin/course/addLesson?courseId=' + courseId, lessonData);
        }
      });
    } else {
      res.render('/admin/course/addLesson?courseId=' + courseId, lessonData);
    }
  });
});

router.get('/editLesson',
  [
    AdminCourseService.mwGetCourseInfo,
    AdminCourseService.mwGetLessonInfo,
    AdminCourseService.mwGetLessonResources,
  ], (req, res) => {

    res.data.formType = 'Edit';

    const values = {};
    values.name = res.data.lesson.get('name');
    values.description = res.data.lesson.get('description');
    values.challenge = res.data.lesson.get('challenge');
    values.videoProvider = res.data.lesson.get('videoProvider');
    values.videoId = res.data.lesson.get('videoId');
    values.order = res.data.lesson.get('order');
    values.section = res.data.lesson.get('sectionName');

    res.data.values = values;
    res.data.courseId = req.query.courseId;
    res.data.lessonId = req.query.lessonId;

    res.data.libs.markdown = markdown;

    res.render('admin/course/addLesson', res.data);

  });

router.post('/editLesson', (req, res) => {



});


// Course Sections
router.get('/addSection',
  [
    AdminCourseService.mwGetCourseInfo,
  ], (req, res) => {

  res.data.courseId = req.query.courseId;
  res.render('admin/course/addSection', res.data);

});

router.post('/addSection', (req, res) => {

  const sectionData = {
    sectionName: req.body.sectionName,
    courseId: req.body.courseId,
  }

  AdminCourseService.mwAddSection(sectionData, (e, courseId) => {
    if (e) {
      res.redirect('/admin/course/addLesson?courseId=' + courseId);
    } else {
      res.render('/admin/course/addSection?courseId=' + courseId, sectionData);
    }
  });
});


// Lesson Quiz
router.get('/addQuizQuestion', (req, res) => {

  res.data.formType = 'Add';
  res.data.lessonId = req.query.lessonId;
  res.data.courseId = req.query.courseId;

  res.render('admin/course/addQuiz', res.data);

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

  AdminCourseService.mwAddUpdateQuestion(question, formOptions, (e) => {
    if (e) {
      res.redirect('/admin/course/editLesson?courseId=' + req.body.courseId + '&lessonId=' + req.body.lessonId);
    } else {
      res.redirect('/admin/course/editLesson?courseId=' + req.body.courseId + '&lessonId=' + req.body.lessonId);
    }
  });
});


router.post('/uploadCardImage', formidable(), (req, res) => {
  const courseId = req.fields.courseId;

  const reader = new FileReader();

  const fileImage = req.files.courseCardImage;

  reader.addEventListener('load', function() {
    const parseFile = new Parse.File(fileImage.name, {base64: reader.result}, fileImage.type);

    parseFile.save().then(function() {
      const courseCard = new CourseModel();
      courseCard.id = courseId;
      courseCard.set('cardImage', parseFile);
      courseCard.save().then(
        () => { res.redirect('/admin/course/course-info?courseId=' + courseId); },
        (error) => {
          // TODO: show error form with error message
          console.log(error);
          res.redirect('/admin/course/course-info?courseId=' + courseId);
        }
      );
    }, function(error) {
      // The file either could not be read, or could not be saved to Parse.
      console.log('parseFile save error');
      console.log(error);
      res.redirect('/admin/course/course-info?courseId=' + courseId);
    });
  }, false);

  reader.readAsDataURL(fileImage);
});

router.post('/uploadBannerImage', formidable(), (req, res) => {
  const courseId = req.fields.courseId;

  const reader = new FileReader();

  const fileImage = req.files.courseBannerImage;

  reader.addEventListener('load', function() {
    const parseFile = new Parse.File(fileImage.name, {base64: reader.result}, fileImage.type);

    parseFile.save().then(function() {
      const courseCard = new CourseModel();
      courseCard.id = courseId;
      courseCard.set('bannerImage', parseFile);
      courseCard.save().then(
        () => { res.redirect('/admin/course/course-info?courseId=' + courseId); },
        (error) => {
          // TODO: show error form with error message
          console.log(error);
          res.redirect('/admin/course/course-info?courseId=' + courseId);
        }
      );
    }, function(error) {
      // The file either could not be read, or could not be saved to Parse.
      console.log('parseFile save error');
      console.log(error);
      res.redirect('/admin/course/course-info?courseId=' + courseId);
    });
  }, false);

  reader.readAsDataURL(fileImage);
});

router.get('/addResource', (req, res) => {
  res.data.courseId = req.query.courseId;
  res.data.lessonId = req.query.lessonId;
  res.render('admin/course/addResource', res.data);

});

router.post('/addResource', [ AdminCourseService.mwGetLessonResourceCount ], formidable(), (req, res) => {
  console.log('In add resource route');

  const courseId = req.fields.courseId;
  const lessonId = req.fields.lessonId;
  const resourceName = req.fields.resourceName;
  const order = res.data.resourceCount + 1;

  console.log('Order :: ' + order);

  const reader = new FileReader();

  const fileResource = req.files.resourceFile;

  reader.addEventListener('load', function() {
    const parseFile = new Parse.File(fileResource.name, {base64: reader.result}, fileResource.type);

    parseFile.save().then(function() {
      const lessonResource = new MediaModel();
      lessonResource.set('file', parseFile);
      lessonResource.set('name', resourceName);
      lessonResource.set('order', order);
      lessonResource.set('lesson', {"__type": "Pointer", "className": "Lesson", "objectId": lessonId});
      lessonResource.save().then(
        () => {
          res.data.courseId = courseId;
          res.data.lessonId = lessonId;
          res.redirect('/admin/course/editLesson?courseId=' + courseId + '&lessonId=' + lessonId);
        },
        (error) => {
          console.log(error);
          res.data.showError = true;
          res.data.courseId = courseId;
          res.data.lessonId = lessonId;
          res.render('admin/course/addResource', res.data);
        }
      );
    }, function(error) {
      // The file either could not be read, or could not be saved to Parse.
      console.log('parseFile save error');
      console.log(error);
      res.data.showError = true;
      res.data.courseId = courseId;
      res.data.lessonId = lessonId;
      res.render('admin/course/addResource', res.data);
    });
  }, false);

  reader.readAsDataURL(fileResource);
});

router.get('/enrollment-info',
  [
    AdminCourseService.mwGetCourseInfo,
    AdminCourseService.mwGetCourseEnrollments,
    AdminCourseService.mwGetCourseUserInfo,
  ], (req, res) => {

    console.log('Enrollments length :: ' + res.data.enrollments.length);
    // res.data.course = res.data.enrollments.get('course');

    res.data.libs.moment = moment;
    res.render('admin/course/enrollment-info', res.data);

  });

router.post('/courseEnrollmentList',
  [
    AdminCourseService.mwGetCourseInfo,
    AdminCourseService.mwGetCourseEnrollments,
    AdminCourseService.mwGetCourseUserInfo,
  ], (req, res) => {

    console.log('in course enrollment list');

    const enrollmentList = [];
    _.each(res.data.enrollments, user => {
      if (user.email) {
        enrollmentList.push({'email': user.email, 'firstName': user.firstName, 'lastName': user.lastName});
      }
    });

    console.log('going to generate csv');
    console.log(enrollmentList);

    const csv = json2csv({ data: enrollmentList });
    const csvName = req.body.courseSlug + '.csv';

    console.log('CSV Name:: ' + csvName);

    res.set('Content-Type', 'text/csv');
    res.attachment(csvName);
    res.status(200).send(csv);
  });


module.exports = router;
