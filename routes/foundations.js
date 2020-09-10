const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

    res.render('foundations/index', res.data);

  });

module.exports = router;