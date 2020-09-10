const express = require('express');
const router = express.Router();

const moment = require('moment');

const AdminService = require('../../services/admin/index.js');
const AdminUserService = require('../../services/admin/user.js');
const AdminCourseService = require('../../services/admin/courses.js');
const AdminInstructors = require('../../services/admin/instructors.js');
const AdminEnrollmentService = require('../../services/admin/enrollment.js');

router.use(AdminService.mwGetAdminUser);

router.get('/',
  [
    // AdminUserService.mwGetUserCount,
    AdminCourseService.mwGetEnrollmentCount,
    AdminCourseService.mwGetEnrollments,
    AdminCourseService.mwGetEnrollmentUser,
  ], (req, res) => {

    console.log('Enrollments length :: ' + res.data.enrollments.length);
    res.data.libs.moment = moment;
    res.render('admin/enrollment/index', res.data);

  });

router.get('/info',
  [
    AdminUserService.mwGetUserInfo,
    AdminUserService.mwGetUserEnrollments,
  ], (req, res) => {

    console.log(res.data.user);

    res.data.libs.moment = moment;

    res.render('admin/enrollment/info', res.data);

  });

router.get('/enroll',
  [
    AdminInstructors.mwGetInstructors,
    AdminCourseService.mwGetCourses,
  ], (req, res) => {

  res.render('admin/enrollment/enroll', res.data);

  });

router.post('/enroll', (req, res) => {
  const coursesType = typeof req.body.courses;

  let courses;
  if (coursesType === 'string') {
    courses = [];
    courses.push(req.body.courses);
  } else {
    courses = req.body.courses;
  }

  const enrollmentData = {
    authId: req.body.id.trim(),
    courses: courses,
  };

  AdminEnrollmentService.mwAddEnrollments(enrollmentData, (e) => {
    if (e) {
      res.redirect('/admin/enrollment');
    } else {
      res.redirect('/admin/enrollment');
    }
  });

});

module.exports = router;
