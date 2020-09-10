// Middleware for adding base response data.
module.exports = (req, res, next) => {
  res.data = {
    libs: {},
  };
  next();
};
