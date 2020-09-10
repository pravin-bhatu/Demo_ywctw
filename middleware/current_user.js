const Parse = require('../modules/parse');

module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.data.currentUser = null;
    return next();
  }
  const query = new Parse.Query(Parse.User);
  query.equalTo('username', req.user._json.user_id);
  query.include('instructor');
  query.first().then(user => {
    res.data.currentUser = user;
    return next();
  }, error => {
    // TODO: Do something with this error.
    res.data.currentUser = null;
    return next();
  });
};
