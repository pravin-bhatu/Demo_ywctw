const express = require('express');
const router = express.Router();

const moment = require('moment');

const DashboardService = require('../../services/dashboard/index.js');
const DashboardPartnerService = require('../../services/dashboard/partner.js');

const Parse = require('../../modules/parse');
const Partner = Parse.Object.extend('Partner');

router.get('/',
  [
    DashboardService.mwGetInstructor,
    DashboardPartnerService.mwGetInstructorPartnerCodes,
  ], (req, res) => {
    // res.render('dashboard/article/addArticle', res.data);
    res.data.values = {};
    res.data.libs.moment = moment;
    res.render('dashboard/partner', res.data);
});

router.post('/',
  [
    DashboardService.mwGetInstructor,
  ], (req, res) => {
    DashboardPartnerService.mwCheckPartnerCodes(req.body.code, (used) => {
      if(used) {
        // TODO: display that the code has already been used.
        res.data.values = req.body;
        res.data.hiddenDupCode = false;
        res.render('dashboard/partner', res.data);
      } else {

        let amountType, amount;
        if (req.body.amountType === 'true') {
          amountType = true;
          amount = req.body.amount;
        } else {
          amountType = false;
          if(req.body.amount > 99) {
            // TODO: setup error if percent amount is over 100
          } else {
            amount = (100 - Number(req.body.amount)) / 100;
          }
        }

        let expires;
        if (req.body.amountType === 'true') {
          expires = true;
        } else {
          expires = false;
        }

        const newPartnerCode = {
          code: req.body.code.toUpperCase(),
          name: req.body.name,
          amount: Number(amount),
          static: amountType,
          expires: expires,
          instructor: res.data.instructor,
          active: true,
        }

        console.log('New Partner Code');
        console.log(newPartnerCode);

        // insert code into Partner table
        const newCode = new Partner();
        newCode.save(newPartnerCode).then(() => {
          res.data.values = {};
          res.redirect('partner');
        }, error => {
          console.log('error' + JSON.stringify(error));
          console.log('error.message :: ' + error.message);
          res.data.values = newPartnerCode;
          res.redirect('partner');
        });
      }
  });
});


router.get('/:code/:action', (req, res) => {

  const action = req.params.action;
  const code = req.params.code;

  DashboardPartnerService.mwUpdatePartnerCodeActive(code, action, (e) => {
    if (e) {
      res.redirect('/dashboard/partner');
    } else {
      res.redirect('/dashboard/partner');
    }
  });

});

router.get('/:code', (req, res) => {
  res.render('dashboard/partnercode', res.data);
});

module.exports = router;
