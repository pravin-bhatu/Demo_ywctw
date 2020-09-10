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

  static mwGetVideo(req, res, next) {
    if (!req.isAuthenticated()) return res.redirect('/');
    if (!req.user._json.app_metadata || !req.user._json.app_metadata.role === 'instructor') {
      return res.redirect('/');
    }
    const query = new Parse.Query(Parse.Object.extend('Library'));
    // query.equalTo('user_id', req.user._json.user_id);
    query.equalTo('FileType', 'IntroVideo');
    query.first().then(files => {
      res.data.files = files;
      return next();
    }, error => {
      res.data.files = [];
      res.data.error = error;
      return next();
    });
  }

}

module.exports = AdminService;