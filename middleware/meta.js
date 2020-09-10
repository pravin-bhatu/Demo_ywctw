module.exports = (req, res, next) => {
  const root = (process.env.NODE_ENV === 'production') ? ('https://' + req.hostname) : 'localhost:3000';
  res.data.meta = {
    siteName: 'You Will Change The World',
    title: 'Online Courses - Share Your Genius',
    description: 'Change lives by taking, or teaching, powerful online courses.',
    siteRoot: root,
    siteCurrent: root + (req.path !== '/' ? req.path : ''),
    siteFull: root + req.originalUrl,
  };
  next();
};