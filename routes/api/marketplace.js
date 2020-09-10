const express = require('express');
const router = express.Router();

const braintree = require('../../modules/braintree.js');

const Parse = require('../../modules/parse');

router.post('/onboard', (req, res) => {
  braintree.webhookNotification.parse(req.body.bt_signature, req.body.bt_payload, (error, webhook) => {
    const query = new Parse.Query(Parse.Object.extend('Instructor'));
    query.equalTo('merchantId', webhook.merchantAccount.id);
    query.first().then(instructor => {
      if (webhook.kind === 'sub_merchant_account_approved') {
        instructor.set('merchantStatus', webhook.merchantAccount.status);
      } else if (webhook.kind === 'sub_merchant_account_declined') {
        if (webhook.merchantAccount) instructor.set('merchantStatus', webhook.merchantAccount.status || 'declined');
        instructor.set('merchantNotice', webhook.message);
      } else {
        return res.status(400).send({});
      }
      instructor.save().then(() => {
        console.log('In Save: ');
        res.status(200).send({});
      }, err => {
        throw Error('Braintree webhook failed to save instructor: ' + err);
      });
    });
  });
});

module.exports = router;
