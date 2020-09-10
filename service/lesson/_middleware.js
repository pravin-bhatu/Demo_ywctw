const Crud = require('./_crud');

exports.getForCourse = (req, res, next) => {
  Crud.read({
    course: res.data.course,
    select: res.data.enrollment ? null : ['sectionName', 'order', 'name'],
  }, (error, lessons) => {
    if (error) return res.redirect('/courses');
    res.data.lessons = lessons;
    next();
  });
};

exports.getForLesson = (req, res, next) => {
  Crud.read({
    single: true,
    slug: req.params.lesson,
    include: ['quiz'],
    course: res.data.course
  }, (error, lesson) => {
    if (error) return res.redirect('/courses');
    res.data.lesson = lesson;
    next();
  });
};

exports.sortByOrder = (req, res, next) => {
  if (!res.data.lessons) return next();
  res.data.lessons = res.data.lessons.sort((a, b) => {
    return a.get('order') - b.get('order');
  });
  next();
};

exports.markComplete = (req, res, next) => {
  if (!res.data.enrollment) return next();

  const lessons = res.data.lessons || res.data.lesson;
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

  if (res.data.lessons) res.data.lessons = lessons;
  if (res.data.lesson) res.data.lesson = lessons;
  next();
};
