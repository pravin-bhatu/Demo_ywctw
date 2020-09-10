const Parse = require('../../modules/parse.js');

const OrderModel = Parse.Object.extend('Order');

const gateway = require('../../modules/braintree');

// const Instructor = Parse.Object.extend('Instructor');


const _ = require('underscore');

class AdminOrderService {

  static mwGetOrders(req, res, next) {
    const ordersQuery = new Parse.Query(Parse.Object.extend('Order'));
    ordersQuery.find().then(orders => {
      res.data.orders = orders;
      return next();
    });
  }

  static mwGetOrderById(req, res, next) {
    const orderQuery = new Parse.Query(Parse.Object.extend('Order'));
    orderQuery.equalTo('objectId', req.query.id);
    orderQuery.find().then(order => {
      res.data.order = order;
      return next();
    });
  }


  static mwGetTransaction(req, res, next) {

    res.data.transactionResults = 'In Braintree to get';

    gateway.transaction.find(req.body.transactionId, (error, transaction) => {
      if (error) {
        res.data.transactionResults = error;
      } else {
        res.data.transactionResults = 'We have a result!';
        res.data.transaction = transaction;

        const order = new OrderModel();

        const data = {
          transactionData: transaction,
          transactionId: transaction.id,
          total: Number(transaction.amount),
          userId: transaction.customFields.userId,
          affiliate: {"__type": "Pointer", "className": "Affiliate", "objectId": transaction.customFields.userReferredBy},
          type: transaction.customFields.productType,
          course: {"__type": "Pointer", "className": "Course", "objectId": transaction.customFields.productId},
          serviceFee: Number(transaction.serviceFeeAmount),
          // partnerCode: transaction.customFields.productCode,

        }

        // Testing this
        order.save(data).then(() => {
          return next();
        }, err => {
          console.log('Error :: ' + JSON.stringify(err));
          res.data.transactionResults = JSON.stringify(err);
          return next();
        });
      }
    });
  }

}

module.exports = AdminOrderService;