const express = require('express');
const router = express.Router();

const Parse = require('../../modules/parse');
const Keen = require('keen-js');
const keenClient = require('../../modules/keen.js');

const DashboardService = require('../../services/dashboard/index.js');
const DashboardCourseService = require('../../services/dashboard/course.js');

const AdminInstructors = require('../../services/admin/instructors.js');

const json2csv = require('json2csv');

router.get('/',
  [
    DashboardService.mwGetInstructor,
    DashboardCourseService.mwGetInstuctorCourses,
    DashboardCourseService.mwGetEnrollments,
    DashboardCourseService.mwGetStudentBody,
  ], (req, res) => {
    res.render('dashboard/index', res.data);
  }
);

router.get('/analytics', [ DashboardService.mwGetInstructor ], (req, res) => {
  res.render('dashboard/soon', res.data);
});

router.get('/marketplace', [ DashboardService.mwGetInstructor ], (req, res) => {
  res.render('dashboard/soon', res.data);
});

router.get('/marketing-tools', [ DashboardService.mwGetInstructor ], (req, res) => {
  res.render('dashboard/soon', res.data);
});

router.get('/affiliate', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/');
  if (!res.data.currentUser || !res.data.currentUser.get('instructor')) {
    return res.redirect('/');
  }
  if (!res.data.currentUser.get('affiliate')) {
    res.data.instructor = res.data.currentUser.get('instructor');
    return res.render('dashboard/affiliate-new', res.data);
  }

  const instructorQuery = new Parse.Query(Parse.Object.extend('Instructor'));
  const courseQuery = new Parse.Query(Parse.Object.extend('Course'));
  const affiliateQuery = new Parse.Query(Parse.Object.extend('Affiliate'));
  instructorQuery.get(res.data.currentUser.get('instructor').id).then(instructor => {
    if (!instructor) return res.redirect('/');
    courseQuery.equalTo('instructor', instructor);
    courseQuery.find().then(courses => {
      affiliateQuery.get(res.data.currentUser.get('affiliate').id).then(affiliate => {
        const visitCount = new Keen.Query('count', {
          eventCollection: 'Visit From Affiliate',
          timeframe: 'this_100_years',
          filters: [{
            'property_name': 'affiliateId',
            'operator': 'eq',
            'property_value': affiliate.id,
          }],
        });
        const signupCount = new Keen.Query('count', {
          eventCollection: 'Signed Up From Affiliate',
          timeframe: 'this_100_years',
          filters: [{
            'property_name': 'affiliateId',
            'operator': 'eq',
            'property_value': affiliate.id,
          }],
        });
        const orderCount = new Keen.Query('count', {
          eventCollection: 'User Enrolled in Course',
          timeframe: 'this_100_years',
          filters: [{
            'property_name': 'affiliateId',
            'operator': 'eq',
            'property_value': affiliate.id,
          }, {
            'property_name': 'coursePrice',
            'operator': 'gt',
            'property_value': 0,
          }],
        });
        keenClient.run([visitCount, signupCount, orderCount], (err, response) => {
          res.data.analytics = {};
          res.data.analytics.visits = response[0].result;
          res.data.analytics.registrations = response[1].result;
          res.data.analytics.orders = response[2].result;
          res.data.courses = courses;
          res.data.instructor = instructor;
          res.data.affiliate = affiliate;
          return res.render('dashboard/affiliate', res.data);
        });
      });
    });
  });
});

router.get('/files', [ DashboardService.mwGetInstructor ], (req, res) => {
  res.render('dashboard/files', res.data);
});

router.get('/settings', [ DashboardService.mwGetInstructor ], (req, res) => {
  // res.render('dashboard/settings', res.data);
  res.render('dashboard/soon', res.data);
});

router.post('/getStudentBody',
  [
    AdminInstructors.mwGetInstructorStudentBody,
  ], (req, res) => {

    const csv = json2csv({ data: res.data.studentList });

    res.set('Content-Type', 'text/csv');
    res.attachment('StudentBodyList.csv');
    res.status(200).send(csv);
});

module.exports = router;
