const _ = require('underscore');

const Parse = require('../modules/parse.js');
const CourseModel = Parse.Object.extend('Course');

const Course = require('../service/course');

class CourseService {
  static mwGetCourses(req, res, next) {
    Course.Crud.read({
      include: ['instructor'],
      select: ['name', 'slug', 'price', 'cardImage', 'stage', 'instructor'],
      limit: 1000
    }, (error, courses = []) => {
      if (error) {
        // TODO: Handle the error...
      }

      function isFeatured(course) {
        if (!res.data.config) return false;
        return (
          course.id === res.data.config.get('featuredCourse1') ||
          course.id === res.data.config.get('featuredCourse2') ||
          course.id === res.data.config.get('featuredCourse3')
        );
      }
      const featuredCourses = courses.filter(course => {
        return isFeatured(course);
      });
      const freeCourses = courses.filter(course => {
        return course.get('price') === 0 && !isFeatured(course) && course.get('stage') === 'prod';
      });
      const paidCourses = courses.filter(course => {
        return course.get('price') !== 0 && !isFeatured(course) && course.get('stage') === 'prod';
      });
      const comingSoonCourses = courses.filter(course => {
        return course.get('stage') === 'stage';
      });

      res.data.courses = {
        featured: featuredCourses,
        free: freeCourses,
        paid: paidCourses,
        comingSoon: comingSoonCourses,
      };
      next();
    });
  }

  static mwGetBySlug(req, res, next) {
    const query = new Parse.Query(CourseModel);
    query.equalTo('slug', req.params.slug);
    query.include('instructor');
    query.include('lessons');
    query.first().then(course => {
      if (course && course.get('instructor')) res.data.instructor = course.get('instructor');
      res.data.course = course;
      res.data.sections = course.get('sections') || null;
      res.data.lessons = course.get('lessons');
      return next();
    }, error => {
      // TODO: Do something with this error.
      return res.redirect('/courses');
    }).catch(() => {
      // no results
      return res.redirect('/courses');
    });
  }

  static mwGetForInstructor(req, res, next) {
    const query = new Parse.Query(CourseModel);
    query.equalTo('instructor', res.data.instructor);
    query.include('instructor');
    query.find().then(courses => {
      res.data.courses = courses;
      return next();
    }, error => {
      // TODO: Do something with this error.
      return res.redirect('/courses');
    });
  }

  static mwMarkLessonsComplete(req, res, next) {
    if (!res.data.enrollment) return next();

    const lessons = res.data.lessons;
    const complete = res.data.enrollment.get('completed');

    if (Array.isArray(lessons)) {
      // Go through each actual completed lesson and find+match it to lessons that exist.
      for (let i = 0; i < complete.length; i++) {
        for (let j = 0; j < lessons.length; j++) {
          if (complete[i] === lessons[j].id) {
            lessons[j].complete = true;
            break;
          }
        }
      }
    } else {
      // Go through each actual completed lesson and find+match it to our lesson
      for (let i = 0; i < complete.length; i++) {
        if (complete[i] === lessons.id) {
          lessons.complete = true;
          break;
        }
      }
    }

    res.data.lessons = lessons;
    next();
  }

  static mwMarkLessonsQuiz(req, res, next) {
    if (!res.data.enrollment) return next();

    const lessons = res.data.lessons;

    res.data.courseExam = false;
    if (Array.isArray(lessons)) {
      for (let i = 0; i < lessons.length; i++) {
        if (Array.isArray(lessons[i].get('quiz'))) {
          lessons[i].quiz = true;
          res.data.courseExam = true;
          if (Array.isArray(res.data.enrollment.get('progress'))) {
            const lessonProgress = res.data.enrollment.get('progress').find(x => x.lesson === lessons[i].id);
            if (lessonProgress && lessonProgress.quiz) {
              if (lessonProgress.quiz.score === lessonProgress.quiz.questions) {
                lessons[i].quizTooltip = 'Quiz Completed';
              } else {
                lessons[i].quizTooltip = lessonProgress.quiz.score + ' out of ' + lessonProgress.quiz.questions + ' correct'
              }
            } else {
              lessons[i].quizTooltip = 'No Quiz Information';
            }
          } else {
            lessons[i].quizTooltip = 'No Quiz Information';
          }
        }
      }
    }

    // has the user taken the exam yet
    res.data.userExam = false;
    if (res.data.enrollment.get('exam')) {
      res.data.userExam = true;
      res.data.userExamResults = res.data.enrollment.get('exam');
    }
    
    res.data.enableCourseExam = res.data.enrollment.get('completed').length === lessons.length ? true : false
    res.data.lessons = lessons;
    next();
  }


  static mwGetCourseExam(req, res, next) {
    if (!res.data.enrollment) return next();

    res.data.hidePassedQuestions = true;
    res.data.hideWarningQuestions = true;

    const query = new Parse.Query(Parse.Object.extend('Question'));
    query.equalTo('course', res.data.course);
    query.find().then(questions => {
      const shuffledQuestions = _.shuffle(questions);
      res.data.exam = shuffledQuestions;
      next();
    });
  }


  static mwAddLessonsToSections(req, res, next) {
    if (!res.data.sections || !res.data.lessons) return next();

    // Give us a local copy for the sake of naming.
    const lessons = res.data.lessons;

    // Map lessons and give us a new array to work with locally.
    const sections = res.data.sections.map((section) => {
      const newSection = {name: section, lessons: []};

      for (let i = 0; i < lessons.length; i++) {
        if (lessons[i].get('sectionName') === section) newSection.lessons.push(lessons[i]);
      }
      return newSection;
    });

    res.data.sections = sections;
    next();
  }
}

module.exports = CourseService;
