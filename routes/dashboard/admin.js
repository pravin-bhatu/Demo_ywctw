const express = require('express');
const router = express.Router();

const Instructor = require('../../service/instructor').Middleware;

const select = (req, res, next) => {
  res.data.dashboardSelect = [{name: 'Admin', link: '/dashboard/admin'}];
  next();
};

const breadcrumb = (req, res, next) => {
  res.data.breadcrumb = [];
  next();
};

/* GET home page. */
router.get('/', [select, breadcrumb], (req, res) => {
  res.data.breadcrumb.push({name: 'Index'});
  res.render('dashboard/admin/index', res.data);
});

router.get('/instructors', [select, breadcrumb, Instructor.getAll], (req, res) => {
  res.data.breadcrumb.push({name: 'Index', link: '/dashboard/admin'});
  res.data.breadcrumb.push({name: 'Instructors'});
  res.render('dashboard/admin/instructors', res.data);
});

router.get('/courses', [select, breadcrumb], (req, res) => {
  res.data.breadcrumb.push({name: 'Index', link: '/dashboard/admin'});
  res.data.breadcrumb.push({name: 'Courses'});
  res.render('dashboard/admin/courses', res.data);
});

module.exports = router;
