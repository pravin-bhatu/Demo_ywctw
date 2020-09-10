const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('team/index', res.data);
});

router.get('/about', (req, res) => {
  res.render('team/about', res.data);
});

module.exports = router;