const express = require('express');
const router = express.Router();

const Money = require('../service/money');
const UserService = require('../services/user');
const AmbassadorService = require('../services/ambassador');

const Parse = require('../modules/parse');

const DiscountModel = Parse.Object.extend('Discount');
const CourseService = require('../services/course.js');
const ArticleService = require('../services/article.js');

const moment = require('moment');
const MarkdownIt = require('markdown-it');
const markdown = new MarkdownIt();
const _ = require('underscore');

/* GET home page. */
router.get('/',
  [
    CourseService.mwGetCourses,
    ArticleService.mwGetArticles,
  ],
  (req, res) => {
    if (req.isAuthenticated()){
      return res.redirect('/account/courses');
    }
    res.data.featuredArticles = _.sample(_.shuffle(res.data.articles), 3);
    res.data.libs.moment = moment;
    res.data.libs.markdown = markdown;
    res.render('index', res.data);
});

router.get('/new-homepage',
  [
    CourseService.mwGetCourses,
    ArticleService.mwGetArticles,
  ],
  (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/account/courses');
    res.data.featuredArticles = _.sample(_.shuffle(res.data.articles), 3);
    res.data.libs.moment = moment;
    res.data.libs.markdown = markdown;
  res.render('homepage-mockup', res.data);
});

router.get('/new-homepage-2',
  [
    CourseService.mwGetCourses,
    ArticleService.mwGetArticles,
  ],
  (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/account/courses');
    res.data.featuredArticles = _.sample(_.shuffle(res.data.articles), 3);
    res.data.libs.moment = moment;
    res.data.libs.markdown = markdown;
    res.render('index-2', res.data);
  }
);


router.get('/about', (req, res) => {
  res.render('about', res.data);
});

router.get('/speaker', (req, res) => {
  res.redirect('/integrate');
});

router.get('/integrate', (req, res) => {
  res.render('integrate', res.data);
});

router.get('/vip/landing', (req, res) => {
  res.redirect('/');
});

router.get('/vip/thank-you', (req, res) => {
  res.render('vip/thank-you', res.data);
});

router.post('/memberships/vip-pioneer', (req, res) => {
  if (!req.isAuthenticated() || !req.body.payment_method_nonce) return res.redirect('/');
  const vipPrice = 19;
  const dateOneYear = moment().add(1, 'year').format();
  Money.Charge.create({
    amount: vipPrice,
    nonce: req.body.payment_method_nonce,
    userId: req.user._json.user_id,
    productType: 'membership',
    productId: 'VIP Membership',
  }).then((braintreeResults) => {
    const VipOrder = Parse.Object.extend('VipOrder');
    const vipOrder = new VipOrder();
    vipOrder.save({
      userId: req.user._json.user_id,
      pricePaid: vipPrice,
    }).then(() => {
      const discount1 = new DiscountModel();
      discount1.id = 'vKvsjiigiw';

      const addUserDiscount = Parse.Object.extend('UserDiscount');
      const addUserDiscountQuery1 = new addUserDiscount()
      addUserDiscountQuery1.save({
        userId: req.user._json.user_id,
        discount: discount1,
        used: 0,
      }).then(() => {
        const discount2 = new DiscountModel();
        discount2.id = 'OWm18oXoPm';

        const addUserDiscount = Parse.Object.extend('UserDiscount');
        const addUserDiscountQuery2 = new addUserDiscount()
        addUserDiscountQuery2.save({
          userId: req.user._json.user_id,
          discount: discount2,
          used: 0,
        }).then(() => {
          return res.redirect('/vip/thank-you');
        }).catch((error) => {
          return res.redirect('back');
        });
      }).catch((error) => {
        return res.redirect('back');
      });
    }).catch((error) => {
      return res.redirect('back');
    });
  }).catch((error) => {
    return res.redirect('back');
  });
});

// USER ACCOUNT
router.get('/account', (req, res) => {
  res.redirect('/account/courses');
});

router.get('/account/courses', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/');
  const query = new Parse.Query(Parse.Object.extend('Enrollment'));
  query.equalTo('userId', req.user._json.user_id);
  query.include('course');
  query.include('course.instructor');
  query.find().then(enrollments => {
    res.data.enrollments = enrollments;
    res.render('user/account/courses', res.data);
  }, error => {
    res.data.enrollments = [];
    res.data.error = error;
    res.render('user/account/courses', res.data);
  });
});

router.get('/march-31-build-a-course', (req, res) => {
  res.render('events/march-31-downloads', res.data);
});

const marketplace = require('../machines/marketplace');
router.get('/testing', (req, res) => {
  marketplace.createSubMerchant({

  }).then(result => {
    res.status(200).send(result);
  }).catch(result => {
    res.status(200).send(result);
  });
});

module.exports = router;
