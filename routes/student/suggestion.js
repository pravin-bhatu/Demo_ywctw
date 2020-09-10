var express = require('express');
var router = express.Router();

const CourseService = require('../../services/course');

// router.get('/', function(req, res, next) {
//   res.render('student/suggestion',res.data);
// });

router.get('/', [CourseService.mwGetCourses], (req, res) => {
  res.render('student/suggestion', res.data);
});


module.exports = router;

 