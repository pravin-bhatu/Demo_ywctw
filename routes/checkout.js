const express = require('express');
const router = express.Router();

const Course = require('../service/course');
const Money = require('../service/money');
const DiscountService = require('../services/discounts.js');
const PartnerService = require('../services/partner.js');
const CheckoutService = require('../services/checkout.js');

router.use(DiscountService.mwGetCourseDiscount);
router.use(DiscountService.mwGetUserDiscounts);
router.use(PartnerService.mwGetPartnerCode);

router.get('/', (req, res) => {
  // if (!req.isAuthenticated()) return res.redirect('/courses');
  res.data.userLoggedIn = req.isAuthenticated();

  if (!req.query.id) return res.redirect('/courses');
  Money.Token().then((token) => {
    Course.Crud.read({
      id: req.query.id || '',
    }, (error, response) => {
      if (error) return res.redirect('back');
      res.data.course = response;
      res.data.token = token;

      if (res.data.discounts) {

        const product = 'course-' + req.query.id;
        res.data.courseDiscount = res.data.discounts.filter(discount => {
          return discount.get('discount').get('productType') === product;
        });
        if (res.data.courseDiscount.length === 1) {
          res.data.discounts = res.data.courseDiscount;
        }
      }

      if (res.data.partnerCode) {
        if (res.data.course.get('instructor').id === res.data.partnerCode.get('instructor').id) {
          res.data.partnerCode.valid = true;
          res.data.hideCodePassed = false;
          res.data.codeMessage = 'Code ' + res.data.partnerCode.get('code') + ' Applied';
        } else {
          res.data.partnerCode.valid = false;
          res.data.hideCodeError = false;
        }
      }

      res.render('checkout', res.data);
    });
  }).catch(() => {
    res.redirect('back');
  });
});

router.post('/apply', (req, res) => {
   console.log(req.query);
   console.log(res.data.user);

  console.log('Course :: ' + req.query.id);
  console.log('Code :: ' + req.body.code);
  res.redirect('/checkout?id=' + req.query.id + '&pc=' + req.body.code);


});


router.post('/getcheckoutVoucherinfo',[CheckoutService.mwgetVoucherValid],(req,res)=>{
     
       // userinfomation
       //var userid=     

      res.send({'errormessage':res.data.errormessage,'successmessage':res.data.successmessage,'voucherstatus':res.data.voucherstatus});



});


module.exports = router;
