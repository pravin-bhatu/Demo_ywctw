const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('quotes/index', res.data);
});

module.exports = router;