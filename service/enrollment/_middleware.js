const Crud = require('./_crud');

exports.enrolledIn = (req, res, next) => {
  if (!req.isAuthenticated() || !res.data.course) return next();

  Crud.read({
    single: true,
    userId: req.user._json.user_id,
    course: res.data.course,
  }, (error, enrollment) => {
    res.data.enrollment = enrollment || null;
    next();
  });
};

exports.checkEnrollment = (req, res, next) => {
  if (!res.data.enrollment) return res.redirect('/courses');
  next();
};
