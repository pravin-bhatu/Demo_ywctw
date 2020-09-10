class UserService {
  static api() {
    const Auth0 = require('auth0');
    const AuthService = require('./auth.js');
    return new Auth0(AuthService.getConfig());
  }

  static read(id = '') {
    return new Promise((resolve, reject) => {
      this.api().getUser(id, (error, user) => {
        if (error) return reject(error);
        return resolve(user);
      });
    });
  }

  static update(id = '', data = {}) {
    return new Promise((resolve, reject) => {
      this.api().patchUserMetadata(id, data, (error) => {
        if (error) return reject(error);
        return resolve();
      });
    });
  }

  static mwRequireSignIn(req, res, next) {
    if (!req.isAuthenticated()) return res.redirect('/');
    return next();
  }

  static mwCurrentUser(req, res, next) {
    if (req.isAuthenticated() && req.user) {
      res.data.user = req.user._json;
    } else {
      res.data.user = null;
    }
    return next();
  }
}

module.exports = UserService;
