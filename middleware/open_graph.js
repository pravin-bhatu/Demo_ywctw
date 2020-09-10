module.exports = (req, res, next) => {
  res.data.meta.og = {
    type: 'website',
    url: res.data.meta.siteCurrent,
    title: res.data.meta.title,
    description: res.data.meta.description,
    siteName: res.data.meta.siteName,
    image: res.data.meta.siteRoot + '/img/opengraph/ywctw-1.jpg',
    appId: process.env.FACEBOOK_APP_ID || '201899130145147',
    locale: 'en_US',
  };
  next();
};
