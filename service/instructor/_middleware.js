const Crud = require('./_crud');

exports.getByUsername = (req, res, next) => {
  Crud.read({
    single: true,
    username: req.params.username,
  }, (error, instructor) => {
    if (error || !instructor) return res.redirect('/courses');
    res.data.instructor = instructor;
    next();
  });
};
