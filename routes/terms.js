const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('terms/index', res.data);
});

router.get('/privacy', (req, res) => {
  res.render('terms/privacy', res.data);
});

router.get('/copyright', (req, res) => {
  res.render('terms/copyright', res.data);
});

router.get('/instructor', (req, res) => {
  res.render('terms/instructor', res.data);
});

router.get('/affiliate', (req, res) => {
  res.render('terms/affiliate', res.data);
});

module.exports = router;
