const express = require('express');
const router = express.Router();

const moment = require('moment');
const _ = require('underscore');

const AdminService = require('../../services/admin/index.js');
const AdminUserService = require('../../services/admin/user.js');
const AdminCourseService = require('../../services/admin/courses.js');

router.use(AdminService.mwGetAdminUser);

router.get('/',
  [
    AdminUserService.mwGetUsers,
    AdminUserService.mwGetUserCount,
    AdminCourseService.mwGetEnrollmentCount,
  ], (req, res) => {

    const regToday = res.data.users.filter(user => {
      return moment(user.get('createdAt')).format('MM-DD-YY') === moment().format('MM-DD-YY');
    });
    res.data.todayCount = regToday.length;

    const regPast7 = res.data.users.filter(user => {
      return moment(user.get('createdAt')).format('x') > moment().subtract(7, 'd').format('x');
    });
    res.data.past7Count = regPast7.length;

    const groupByMonths = _.groupBy(res.data.users, user => {
      return moment(user.get('createdAt')).format('MM-YY');
    });

    let groupMonth = 0;
    _.each(groupByMonths, months => {
      console.log(_.keys(groupByMonths)[groupMonth] + ' :: ' + months.length);
      // console.log(months.length);
      groupMonth++;
    })

    res.data.libs.moment = moment;
    res.render('admin/index', res.data);

});

module.exports = router;