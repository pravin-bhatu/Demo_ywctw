const express = require('express');
const router = express.Router();

const marketplace = require('../../machines/marketplace');

const Parse = require('../../modules/parse');

router.get('/', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/');
  if (!req.user._json.app_metadata || !req.user._json.app_metadata.role === 'instructor') {
    return res.redirect('/');
  }
  const instructorQuery = new Parse.Query(Parse.Object.extend('Instructor'));
  const courseQuery = new Parse.Query(Parse.Object.extend('Course'));
  instructorQuery.equalTo('authId', req.user._json.user_id);
  instructorQuery.first().then(instructor => {
    if (!instructor) return res.redirect('/');
    courseQuery.equalTo('instructor', instructor);
    courseQuery.find().then(courses => {
      res.data.courses = courses;
      res.data.instructor = instructor;
      res.render('dashboard/index', res.data);
    });
  });
});

router.get('/onboard', (req, res) => {
  res.data.values = {};
  res.render('dashboard/marketplace-onboarding', res.data);
});

/**
 * Posts form data from the Marketplace Onboarding page to our marketplace service.
 */
router.post('/onboard', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/');
  if (!req.user._json.app_metadata || !req.user._json.app_metadata.role === 'instructor') {
    return res.redirect('/');
  }

  const merchantData = {
    individual: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      dateOfBirth: req.body.dateOfBirth,
      ssn: req.body.ssn,
      address: {
        streetAddress: req.body.streetAddress,
        locality: req.body.city,
        region: req.body.state,
        postalCode: req.body.zip,
      },
    },
    business: {
      legalName: req.body.businessLegal,
      dbaName: req.body.businessDBA,
      taxId: req.body.businessTaxId,
      address: {
        streetAddress: req.body.businessStreetAddress,
        locality: req.body.businessCity,
        region: req.body.businessState,
        postalCode: req.body.businessZip,
      },
    },
    funding: {
      destination: 'bank',
      accountNumber: req.body.paymentAccount,
      routingNumber: req.body.paymentRouting,
    },
    tosAccepted: req.body.tosAccepted,
  };

  marketplace.createSubMerchant(merchantData).then(result => {
    const instructorQuery = new Parse.Query(Parse.Object.extend('Instructor'));
    instructorQuery.equalTo('authId', req.user._json.user_id);
    instructorQuery.first().then(instructor => {
      if (!instructor) return res.redirect('/');
      instructor.set('merchantId', result.merchantAccount.id);
      instructor.set('merchantStatus', result.merchantAccount.status);
      instructor.save().then(() => {
        res.status(200).send(result);
      }, error => {
        res.status(200).send({success: false, error: error.message});
      });
    });
  }).catch(result => {
    res.status(200).send({success: false, error: result});
  });
});

module.exports = router;
