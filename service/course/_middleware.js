const Crud = require('./_crud');

exports.getBySlug = (req, res, next) => {
  Crud.read({
    single: true,
    slug: req.params.slug,
    include: ['instructor'],
  }, (error, course) => {
    if (error || !course) return res.redirect('/courses');
    if (course.get('instructor')) res.data.instructor = course.get('instructor');
    res.data.course = course;
    next();
  });
};

exports.getForLesson = (req, res, next) => {
  Crud.read({
    single: true,
    slug: req.params.slug,
    select: [
      'name', 'slug', 'instructor', 'lessons', 'lessons.slug'
    ],
    include: ['instructor', 'lessons'],
  }, (error, course) => {
    if (error || !course) return res.redirect('/courses');
    if (course.get('instructor')) res.data.instructor = course.get('instructor');
    res.data.course = course;
    next();
  });
};

exports.getForInstructor = (req, res, next) => {
  Crud.read({
    instructor: res.data.instructor,
  }, (error, courses) => {
    if (error || !courses) return res.redirect('/courses');
    res.data.courses = courses;
    next();
  });
};
