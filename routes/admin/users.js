const express = require('express');
const router = express.Router();
const Parse = require('../../modules/parse.js');

const AdminService = require('../../services/admin/index.js');
const AdminUserService = require('../../services/admin/user.js')

// const markdown = require('marked');
const moment = require('moment');


router.use(AdminService.mwGetAdminUser);

router.get('/', (req, res) => {

  res.data.libs.moment = moment;
  res.render('admin/article/index', res.data);


});


router.get('/info',
  [
    AdminUserService.mwGetUserInfo,
    AdminUserService.mwGetUserEnrollments,
  ], (req, res) => {
    console.log(JSON.stringify(res.data.user));
    console.log(res.data.enrollments);

    res.data.libs.moment = moment;
    res.render('admin/user/info', res.data);
});

router.get('/search', (req, res) => {

  res.render('admin/user/search');

});

router.post('/search', (req, res) => {

  let searchText = req.body.searchText;
  if(req.body.searchType === 'email') {
    searchText = req.body.searchText.toLowerCase();
  }

  const searchData = {
    text: searchText,
    type: req.body.searchType,
  }

  res.data.libs.moment = moment;

  AdminUserService.mwUserSearch(searchData, (e, results) => {
    if (e) {
      res.data.users = results;
      res.render('admin/user/search', res.data);
    } else {
      res.render('admin/user/search');
    }
  });
});

router.get('/updateReferredBy',
  [
    AdminUserService.mwGetUserInfo,
  ], (req, res) => {


    res.render('admin/user/updateReferredBy', res.data);

});

router.get('/setAffiliateCode', (req, res) => {

  const userId = req.query.id;
  const userEmailId = req.query.email;

  AdminUserService.mwSetAffiliateCode(userId, (e) => {
    if (e) {
      res.redirect('info?type=email&id=' + userEmailId);
    } else {
      res.redirect('info?type=email&id=' + userEmailId);
    }
  });
});

router.post('/updateReferredBy', (req, res) => {

  const data = {
    referredBy: req.body.referredBy.trim(),
    userId: req.body.userId,
  }

  AdminUserService.mwUpdateUserReferredBy(data, (e) => {
    if (e) {
      res.redirect('info?type=username&id=' + req.body.userAuthId);
    } else {
      res.redirect('info??type=username&id=' + req.body.userAuthId);
    }
  });
});


module.exports = router;
