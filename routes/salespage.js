const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

  res.render('salespage/index', res.data);

});


router.get('/john-burke', (req, res) => {

  res.data.meta.title = 'John Burke | Become A Big Time TV Host course for only $99';
  res.data.meta.og.title = 'John Burke | Become A Big Time TV Host course for only $99';
  res.data.meta.og.image = 'https://ywctw-parse.s3.amazonaws.com/8e178843271f6f98f9199f8931e112ca_ohn-burke-big-money-tv-host-card.jpg';

  res.render('salespage/john-burke-become-a-big-money-tv-host-99', res.data);

});


router.get('/john-burke-become-a-big-money-tv-host-99', (req, res) => {

  res.data.meta.title = 'John Burke | Become A Big Time TV Host course for only $99';
  res.data.meta.og.title = 'John Burke | Become A Big Time TV Host course for only $99';
  res.data.meta.og.image = 'https://ywctw-parse.s3.amazonaws.com/8e178843271f6f98f9199f8931e112ca_ohn-burke-big-money-tv-host-card.jpg';

  res.render('salespage/john-burke-become-a-big-money-tv-host-99', res.data);

});

router.get('/instant-credibility-us', (req, res) => {

  res.data.meta.title = 'Instant Credibility US';
  res.data.meta.og.title = 'Instant Credibility US';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/pr_package.png';

  res.render('salespage/instant-credibility-us', res.data);

});

router.get('/peter-anthony-online-course-creation', (req, res) => {

  res.data.meta.title = 'Peter Anthony - How To Create Amazing Online Courses';
  res.data.meta.og.title = 'Peter Anthony - How To Create Amazing Online Courses';
  res.data.meta.og.image = 'http://files.parsetfss.com/087816d2-e548-4ce5-b90e-fbecdae40a77/tfss-757622a9-3daa-4314-8316-a4287e06e971-online-course.jpg';

  res.render('salespage/peter-anthony-online-course-creation', res.data);

});

module.exports = router;