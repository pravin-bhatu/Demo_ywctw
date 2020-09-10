const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('support/index', res.data);
});

module.exports = router;