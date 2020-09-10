const express = require('express');
const router = express.Router();

const AdminService = require('../../services/admin/index.js');
const AdminOrderService = require('../../services/admin/orders.js');

router.use(AdminService.mwGetAdminUser);

router.get('/',
  [
    AdminOrderService.mwGetOrders,
  ], (req, res) => {

    console.log('Testing');
    res.render('admin/orders/index', res.data);
});

router.get('/order-info',
  [
    AdminOrderService.mwGetOrderById,
  ], (req, res) => {

    res.render('admin/orders/info', res.data);

});


router.get('/addTransaction', (req, res) => {

  res.data.transactionResults = 'Getting Transaction';
  res.render('admin/orders/add', res.data);

});

router.post('/addTransaction',
  [
    AdminOrderService.mwGetTransaction,
  ], (req, res) => {

    res.render('admin/orders/add', res.data);

});


module.exports = router;