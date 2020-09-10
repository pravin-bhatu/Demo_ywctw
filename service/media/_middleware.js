const Crud = require('./_crud');

exports.getForCourse = (req, res, next) => {
  Crud.read({
    course: res.data.course,
  }, (error, media) => {
    if (error) return res.redirect('/courses');
    res.data.course = res.data.course || {};
    res.data.course.media = media;
    next();
  });
};
