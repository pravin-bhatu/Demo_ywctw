const express = require('express');
const router = express.Router();

const AdminService = require('../../services/admin/index.js');

router.use(AdminService.mwGetAdminUser);

router.post('/', (req, res) => {

  console.log('Testing');
  console.log('Search Input: ' + req.body.searchInput);

});

module.exports = router;