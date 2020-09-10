const Parse = require('../../modules/parse.js');
const _ = require('underscore');

const CourseModel = Parse.Object.extend('Course');
const LessonModel = Parse.Object.extend('Lesson');
const QuestionModel = Parse.Object.extend('Question');

class AdminCourseService {

  static mwGetCourses(req, res, next) {
    const coursesQuery = new Parse.Query(Parse.Object.extend('Course'));
    coursesQuery.include('instructor');

    // filter by prod, stage, dev if filter is set
    if (req.query.filter) {
      coursesQuery.equalTo('stage', req.query.filter);
    }

    coursesQuery.limit(1000);
    coursesQuery.find().then(courses => {
      res.data.courses = _.sortBy(courses, function(course) { return course.get('instructor').get('name'); }); //.get('name')
      return next();
    });
  }

  static mwGetCourseInfo(req, res, next) {
    let courseId;
    if (req.query.courseId) {
      courseId = req.query.courseId;
    } else {
      courseId = req.body.courseId
    }

    const query = new Parse.Query(Parse.Object.extend('Course'));
    query.include('instructor');
    query.include('lessons');
    query.equalTo('objectId', courseId);
    query.first().then(course => {
      res.data.course = course;
      res.data.lessons = course.get('lessons');
      return next();
    });
  }

  static mwGetLessonInfo(req, res, next) {
    const query = new Parse.Query(Parse.Object.extend('Lesson'));
    query.include('quiz');
    query.equalTo('objectId', req.query.lessonId);
    query.first().then(lesson => {
      res.data.lesson = lesson;
      res.data.questions = lesson.get('quiz');
      return next();
    });
  }

  static mwGetLessonResources(req, res, next) {
    const query = new Parse.Query(Parse.Object.extend('Media'));
    query.equalTo('lesson', {'__type': 'Pointer', 'className': 'Lesson', 'objectId': req.query.lessonId});
    query.find().then(resources => {
      res.data.resources = resources;
      return next();
    });
  }

  static mwGetEnrollments(req, res, next) {
    const enrollmentQuery = new Parse.Query(Parse.Object.extend('Enrollment'));
    enrollmentQuery.include('course');
    enrollmentQuery.descending('createdAt');
    enrollmentQuery.limit(1000);
    enrollmentQuery.find().then(enrollments => {
      res.data.enrollments = enrollments;
      return next();
    });
  }

  static mwGetCourseEnrollments(req, res, next) {
    let courseId;
    if (req.query.courseId) {
      courseId = req.query.courseId;
    } else {
      courseId = req.body.courseId
    }

    const query = new Parse.Query(Parse.Object.extend('Enrollment'));
    query.equalTo('course', {'__type': 'Pointer', 'className': 'Course', 'objectId': courseId});
    query.include('course');
    query.descending('createdAt');
    query.limit(1000);
    query.find().then(enrollments => {
      res.data.enrollments = enrollments;
      return next();
    });
  }

  static mwGetCourseUserInfo(req, res, next) {
    if (res.data.enrollments.length === 0) return next();

    console.log('Enrollments');
    console.log(res.data.enrollments);

    // TODO: get usernames list from enrollments
    const usernames = [];
    _.each(res.data.enrollments, enrollment => {
      if (!_.contains(usernames, enrollment.get('userId'))) {
        console.log('adding :: ' + enrollment.get('userId'));
        usernames.push(enrollment.get('userId'));
      }
    });

    console.log('Usernames::');
    console.log(usernames);

    const enrollments = res.data.enrollments;

    const userQuery = new Parse.Query(Parse.Object.extend('User'));
    userQuery.containedIn('username', usernames);
    userQuery.limit(1000);
    userQuery.find().then(users => {
      _.each(users, user => {
        console.log('user :: ' + user.get('username'));
        _.each(enrollments, enrollment => {
          if (enrollment.get('userId') === user.get('username')) {
            enrollment.email = user.get('email');
            enrollment.firstName = user.get('firstName');
            enrollment.lastName = user.get('lastName');
          }
        });
      });
      console.log('enrollments::');
      console.log(enrollments);
      res.data.enrollments = enrollments;
      return next();
    });

  }

  static mwGetCourseEnrollmentCount(req, res, next) {
    const query = new Parse.Query(Parse.Object.extend('Enrollment'));
    query.equalTo('course', {'__type': 'Pointer', 'className': 'Course', 'objectId': req.query.courseId});
    query.count().then(enrollmentCount => {
      res.data.enrollmentCount = enrollmentCount;
      return next();
    });
  }


  static mwGetEnrollmentCount(req, res, next) {
    const totalQuery = new Parse.Query(Parse.Object.extend('Enrollment'));
    totalQuery.count().then(totalCount => {
      res.data.enrollmentCount = totalCount;
      return next();
    });
  }

  static mwGetEnrollmentUser(req, res, next) {
    console.log('in mwGetEnrollment');
    // make list of unique userId/username
    let userArray = [];
    _.each(res.data.enrollments, enrollment => {
      if (!_.contains(userArray, enrollment.userId)) {
        console.log('adding :: ' + enrollment.userId);
        userArray.push(enrollment.userId);
      }
    });

    console.log('userArray :: ' + userArray);
    console.log('userArray Length :: ' + userArray.length);

    // get users from user table
    // loop thru enrollments and add user info to enrollment
    return next();

  }


  static mwAddUpdateCourse(data, options, callback) {
    const course = new CourseModel();
    if (options.type === 'Edit') {
      course.id = options.courseId;
    }

    course.save(data).then((result) => {
      if (options.type === 'Add') {
        callback(true, result.id);
      } else {
        callback(true, options.courseId);
      }

    }, error => {
      console.log('Error :: ' + JSON.stringify(error));
      callback(false);
    });
  }


  static mwAddUpdateLesson(data, options, callback) {

    const courseId = options.courseId;

    const lesson = new LessonModel();
    if (options.type === 'Edit') {
      lesson.id = options.lessonId;
    }

    lesson.save(data).then((result) => {
      if(options.type === 'Add') {

        let lessonId = result.id;

        const query = new Parse.Query(Parse.Object.extend('Course'));
        // query.include('instructor');
        query.equalTo('objectId', courseId);
        query.first().then(course => {

          const lessons = course.get('lessons');
          lessons.push({"__type": "Pointer", "className": "Lesson", "objectId": lessonId});

          const updateData = {
            lessons: lessons,
          };

          // TODO: save back to course table
          const updateCourse = new CourseModel();
          updateCourse.id = courseId;
          updateCourse.save(updateData).then(() => {
            callback(true, courseId);
          }, error => {
            console.log('Error :: ' + JSON.stringify(error));
            callback(false);
          });

        }, error => {
          console.log('Error :: ' + JSON.stringify(error));
          callback(false);
        });
      } else {
        callback(true, courseId);
      }
    }, error => {
      console.log('Error :: ' + JSON.stringify(error));
      callback(false);
    });
  }


  static mwUpdateLessonOrder(courseId, callback) {
    console.log('In mwUpdateLessonOrder')
    const orderQuery = new Parse.Query(Parse.Object.extend('Course'));
    orderQuery.equalTo('objectId', courseId);
    orderQuery.include('lessons');
    orderQuery.first().then(course => {
      const orderLessons = course.get('lessons').sort((a, b) => {
        return a.get('order') - b.get('order');
      }) || null;
      const updateOrder = {
        lessons: orderLessons,
      };
      const updateLessonOrder = new CourseModel();
      updateLessonOrder.id = courseId;
      updateLessonOrder.save(updateOrder).then(() => {
        callback(true);
      }, error => {
        console.log('Error :: ' + JSON.stringify(error));
        callback(false);
      });
    }, error => {
      console.log('Error :: ' + JSON.stringify(error));
      callback(false);
    });
  }


  static mwAddSection(data, callback) {
    const courseId = data.courseId;

    const query = new Parse.Query(Parse.Object.extend('Course'));
    query.equalTo('objectId', courseId);
    query.first().then(course => {

      let sections = course.get('sections');

      if (sections.length === 1 & sections[0] === 'Course') {
        sections = [];
        sections.push(data.sectionName);
      } else {
        sections.push(data.sectionName);
      }

      const updateData = {
        sections: sections,
      };

      const updateCourse = new CourseModel();
      updateCourse.id = courseId;
      updateCourse.save(updateData).then(() => {
        callback(true, courseId);
      }, error => {
        console.log('Error :: ' + JSON.stringify(error));
        callback(false);
      });
    });
  }

  static mwAddUpdateQuestion(data, options, callback) {
    const quizQuestion = new QuestionModel();

    quizQuestion.save(data).then((result) => {
      const questionId = result.id;

      const query = new Parse.Query(Parse.Object.extend('Lesson'));
      // query.include('instructor');
      query.equalTo('objectId', options.lessonId);
      query.first().then(lesson => {

        let quiz = [];
        if(lesson.get('quiz')) {
          quiz = lesson.get('quiz');
          quiz.push({"__type": "Pointer", "className": "Question", "objectId": questionId});
        } else {
          quiz.push({"__type": "Pointer", "className": "Question", "objectId": questionId});
        }

        const updateData = {
          quiz: quiz,
        };

        const updateLesson = new LessonModel();
        updateLesson.id = options.lessonId;
        updateLesson.save(updateData).then(() => {
          callback(true);
        }, error => {
          console.log('Error :: ' + JSON.stringify(error));
          callback(false);
        });

      }, error => {
        console.log('Error :: ' + JSON.stringify(error));
        callback(false);
      });

    }, error => {
      console.log('Error :: ' + JSON.stringify(error));
      callback(false);
    });

  }

  static mwGetLessonResourceCount(req, res, next) {
    console.log('In mwGetLessonResourceCount');

    const lessonId = req.body.lessonId;

    console.log('LessonID :: ' + req.body.lessonId);

    const resourceCount = new Parse.Query(Parse.Object.extend('Media'));
    resourceCount.equalTo('lesson', {"__type": "Pointer", "className": "Lesson", "objectId": req.body.lessonId});
    resourceCount.count().then(totalCount => {
      console.log('result.count :: ' + totalCount);
      res.data.resourceCount = totalCount;
      return next();
    }, error => {
      console.log('error :: ' + error);
    });
  }

}

module.exports = AdminCourseService;
