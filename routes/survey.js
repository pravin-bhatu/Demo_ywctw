const express = require('express');
const router = express.Router();

/* GET survey page. */
router.get('/', (req, res) => {
  res.data.showForm = true;
  res.data.showThankYou = false;
  res.render('survey', res.data);
});

router.post('/', (req, res) => {
  res.data.showForm = false;
  res.data.showThankYou = true;
  res.render('survey', res.data);

});

module.exports = router;