const Parse = require('../modules/parse');

module.exports = (req, res, next) => {
  Parse.Config.get().then(
    config => {
      res.data.config = config;
      return next();
    },
    () => {
      res.data.config = null;
      return next();
    }
  );
};
