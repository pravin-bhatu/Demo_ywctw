const express = require('express');
const router = express.Router();

const AdminService = require('../../services/admin/index.js');

router.use(AdminService.mwGetAdminUser);

router.get('/', (req, res) => {
  res.render('admin/assets/index');
});

router.get('/ywctwImages', (req, res) => {
  res.render('admin/assets/ywctwImages');
});

router.get('/pa', (req, res) => {
  res.render('admin/assets/pa');
});

module.exports = router;
