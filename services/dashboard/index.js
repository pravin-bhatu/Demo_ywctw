const Parse = require('../../modules/parse.js');


class DashboardService {

  static mwGetInstructor(req, res, next) {
    if (!req.isAuthenticated()) return res.redirect('/');
    if (!req.user._json.app_metadata || !req.user._json.app_metadata.role === 'instructor') {
      return res.redirect('/');
    }

    const instructorQuery = new Parse.Query(Parse.Object.extend('Instructor'));
    instructorQuery.equalTo('authId', req.user._json.user_id);
    instructorQuery.first().then(instructor => {
      if (!instructor) return res.redirect('/');
      res.data.instructor = instructor;
      return next();
    });
  }

}

module.exports = DashboardService;
