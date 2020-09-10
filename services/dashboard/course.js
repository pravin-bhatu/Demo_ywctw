const Parse = require('../../modules/parse.js');
const _ = require('underscore');

const CourseModel = Parse.Object.extend('Course');
const LessonModel = Parse.Object.extend('Lesson');
const QuestionModel = Parse.Object.extend('Question');

class DashboardCourseService {

  static mwGetInstuctorCourses(req, res, next) {
    const courseQuery = new Parse.Query(Parse.Object.extend('Course'));
    courseQuery.equalTo('instructor', res.data.instructor);
    courseQuery.find().then(courses => {
      res.data.courses = courses;
      return next();
    });
  }

  static mwGetCourseInfo(req, res, next) {
    const query = new Parse.Query(Parse.Object.extend('Course'));
    query.include('instructor');
    query.include('lessons');
    query.equalTo('objectId', req.query.courseId);
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

  static mwGetEnrollments(req, res, next) {
    res.data.totalEnrollments = 0;
    if (res.data.courses.length === 0) return next();

    const courses = res.data.courses;

    const enrollmentQuery = new Parse.Query(Parse.Object.extend('Enrollment'));
    enrollmentQuery.containedIn('course', courses);
    enrollmentQuery.limit(1000);
    enrollmentQuery.find().then(enrollments => {
      res.data.totalEnrollments = enrollments.length;
      _.each(courses, function(course) {
        let courseEnrollments = [];
        _.each(enrollments, function(enrollment) {
          if (course.id === enrollment.get('course').id) {
            courseEnrollments.push(enrollment);
          }
        });
        course.enrollments = courseEnrollments;
        course.studentBody = [];
      });
      return next();
    });
  }

  static mwGetStudentBody(req, res, next) {
    if (res.data.courses.length === 0) return next();

    const courses = res.data.courses;

    res.data.countStudentBody = 0;

    if (!res.data.instructor.get('affiliate')) return next();

    const userQuery = new Parse.Query(Parse.Object.extend('User'));
    userQuery.equalTo('referredBy', res.data.instructor.get('affiliate'));
    userQuery.limit(1000);
    userQuery.find().then(students => {
      res.data.countStudentBody = students.length;

      _.each(courses, function(course) {
        let courseStudentBody = [];
        _.each(students, function(student) {
          _.each(course.enrollments, function(enrollment) {
            if (enrollment.get('userId') === student.get('username')) {
              courseStudentBody.push(student);
            }
          });
        });
        course.studentBody = courseStudentBody;
      });
      return next();
    });
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
  
  
  static mwGetCourseName(req, res, next){
		console.log('fetching the course name');    
		
        const query = new Parse.Query(Parse.Object.extend('Course'));
        query.equalTo('objectId', req.params.courseid);
        query.first().then(course => {
          CourseTask[course.id]=course.get('name');
          CourseInstructor[course.id]=course.get('instructorName');
          res.data.coursename = course.get('name');
          res.data.courseid= course.id;
          return next();
        });	
  }

  
  static mwGetVoucherInfo(req,res,next){		
	  console.log('voucher info called!');
	  console.log(req.params.courseid);	  
	  const voucherquery = new Parse.Query(Parse.Object.extend('VoucherDetails'));	
    voucherquery.equalTo('courseId',req.params.courseid);	
    voucherquery.descending("updatedAt"); 
    voucherquery.limit(5000); 
	  voucherquery.find().then(vouchers =>{  
      console.log(vouchers);       
		  res.data.vouchers = vouchers;
		  res.data.totalvoucher = vouchers.length;	  		  
		  return next();
	  });	  
	}
	
	static mwGetVoucherAvailable(req,res,next){		
	  console.log('voucher Avaiable  called!');
	  console.log(req.params.courseid);	  
	  const voucherquery = new Parse.Query(Parse.Object.extend('VoucherDetails'));	
      voucherquery.equalTo('courseId',req.params.courseid);	 
      voucherquery.equalTo('Status','Available');
      voucherquery.limit(5000); 	  
	    voucherquery.find().then(records =>{ 		  		   
		  res.data.voucherAvailable=records.length;
		  return next();
	  });	  
	}
	static mwGetVoucherRedeem(req,res,next){			  	  
	  const voucherquery = new Parse.Query(Parse.Object.extend('VoucherDetails'));	
      voucherquery.equalTo('courseId',req.params.courseid);	 
	  voucherquery.notEqualTo('Status','Available');      	  
	  voucherquery.find().then(records =>{ 		  		   
		  res.data.voucherReedeemed=records.length;
		  return next();
	  });	  
	}
	
	static mwGetCSVDownload(req,res,next){
	     
		const voucherquery = new Parse.Query(Parse.Object.extend('VoucherDetails'));	
    voucherquery.equalTo('courseId',req.params.courseid);
    voucherquery.descending("updatedAt"); 
    voucherquery.limit(5000); 
		voucherquery.find().then(vouchers =>{ 
		 res.data.vouchers=vouchers;
		 return next();
		});		
	  
		 // return next();
	
	}

}

module.exports = DashboardCourseService;