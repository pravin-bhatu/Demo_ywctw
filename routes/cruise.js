const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('http://marketerscruise.com/affiliate_page.php?affiliate=d6b4a4dd1924f72c070fa24b20f291c2');
});

module.exports = router;
