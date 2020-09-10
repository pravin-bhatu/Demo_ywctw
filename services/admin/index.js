const Parse = require('../../modules/parse.js');
// const _ = require('underscore');

class AdminService {

  static mwGetAdminUser(req, res, next) {
    if (!req.isAuthenticated()) return res.redirect('/');

    const adminQuery = new Parse.Query(Parse.Object.extend('User'));
    adminQuery.equalTo('username', req.user._json.user_id);
    adminQuery.first().then(user => {
      console.log('User Admin :: ' + user.get('admin'));
      if (!user.get('admin')) return res.redirect('/');
        return next();
      });
  }

}

module.exports = AdminService;