const Parse = require('../../modules/parse.js');

const User = Parse.Object.extend('User');
const Affiliate = Parse.Object.extend('Affiliate');

class AdminUserService {

  static mwGetUsers(req, res, next) {
    const usersQuery = new Parse.Query(Parse.Object.extend('User'));
    usersQuery.include('referredBy');
    usersQuery.include('referredBy.instructor');
    usersQuery.include('instructor');
    usersQuery.descending('createdAt');
    usersQuery.limit(1000);
    usersQuery.find().then(users => {
      res.data.users = users;
      return next();
    });
  }

  static mwGetUserCount(req, res, next) {
    const countQuery = new Parse.Query(Parse.Object.extend('User'));
    countQuery.count().then(userCount => {
      res.data.userCount = userCount;
      return next();
    });
  }


  static mwGetUserInfo(req, res, next) {
    const userInfo = new Parse.Query(Parse.Object.extend('User'));
    userInfo.include('referredBy');
    userInfo.include('referredBy.instructor');
    userInfo.include('referredBy.ambassador');
    userInfo.include('referredBy.ambassador.user');
    userInfo.include('instructor');
    if (req.query.type === 'username') {
      userInfo.equalTo('username', req.query.id);
    } else {
      userInfo.equalTo('email', req.query.id);
    }
    userInfo.first().then(user => {
      res.data.user = user;
      return next();
    });
  }

  static mwGetUserEnrollments(req, res, next) {
    console.log('Username :: ' + res.data.user.get('username'));
    const userEnrollments = new Parse.Query(Parse.Object.extend('Enrollment'));
    userEnrollments.include('course');
    userEnrollments.equalTo('userId', res.data.user.get('username'));
    userEnrollments.descending('createdAt');
    userEnrollments.find().then(enrollments => {
      res.data.enrollments = enrollments;
      return next();
    });
  }

  static mwUserSearch(data, callback) {
    const usersQuery = new Parse.Query(Parse.Object.extend('User'));
    usersQuery.equalTo(data.type, data.text);
    usersQuery.include('referredBy');
    usersQuery.include('referredBy.instructor');
    usersQuery.include('referredBy.ambassador');
    usersQuery.include('referredBy.ambassador.user');
    usersQuery.find().then(users => {
      callback(true, users);
    });
  }


  static mwUpdateUserReferredBy(data, callback) {
    const userInfo = {
      referredBy: {'__type': 'Pointer', 'className': 'Affiliate', 'objectId': data.referredBy},
    };
    const user = new User();
    user.id = data.userId;
    user.save(userInfo, {useMasterKey: true}).then(() => {
      callback(true);
    }, error => {
      console.log('Error :: ' + JSON.stringify(error));
      callback(false);
    });
  }

  static mwSetAffiliateCode(userId, callback) {
    const affiliate = new Affiliate();
    const affiliateInfo = {
      user: {"__type":"Pointer","className":"_User","objectId": userId},
    }
    affiliate.save(affiliateInfo).then((result) => {
      const user = new Parse.User();
      user.id = userId;
      const userInfo = {
        affiliate: {'__type': 'Pointer', 'className': 'Affiliate', 'objectId': result.id},
      }
      user.save(userInfo, {useMasterKey: true}).then(() => {
        callback(true);
      }, error => {
        console.log('Error :: ' + error.code + ' ' + error.message);
        callback(false);
      });
    }, error => {
      console.log('Error :: ' + JSON.stringify(error));
      callback(false);
    });
  }

}

module.exports = AdminUserService;