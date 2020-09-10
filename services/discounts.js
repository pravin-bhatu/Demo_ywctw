const Parse = require('../modules/parse.js');
const DiscountModel = Parse.Object.extend('Discount');
const UserDiscountModel = Parse.Object.extend('UserDiscount');

const _ = require('underscore');

class DiscountsService {
  static mwGetUserDiscounts(req, res, next) {
    if (!req.isAuthenticated()) return next();
    const query = new Parse.Query(UserDiscountModel);
    query.equalTo('userId', req.user._json.user_id);
    query.include('discount');
    query.find().then(discounts => {

      res.data.discounts = discounts.filter(discount => {
        return discount.get('used') < discount.get('discount').get('uses');
      });

      _.each(discounts, function(discount) {
        if(discount.get('discount').id === 'OWm18oXoPm') {
          res.data.discounts = discounts.filter(discount => {
            return discount.get('discount').id === 'OWm18oXoPm';
          });
        }
      });



      return next();
    }, () => {
      return next();
    });
  }

  static mwAffiliateDiscount(req, res, next) {
    if (!req.isAuthenticated()) return next();
    if (!res.data.currentUser) return next();
    if (res.data.currentUser.get('referredBy')) {
      const discount = new DiscountModel();
      discount.id = 'BiWVh1BrEK';

      const query = new Parse.Query(UserDiscountModel);
      query.equalTo('userId', req.user._json.user_id);
      query.equalTo('discount', discount);
      query.find().then(
        userDiscounts => {
          if (userDiscounts.length) return next();
          const userDiscount = new UserDiscountModel();
          userDiscount.save({
            userId: req.user._json.user_id,
            discount: discount,
            used: 0,
          }).then(
            () => { return next(); },
            () => { return next(); }
          );
        },
        () => {
          return next();
        }
      );
    } else {
      return next();
    }
  }

  static mwGetCourseDiscount(req, res, next) {
    if (!req.query.dc) return next();

    const query = new Parse.Query(DiscountModel);
    query.equalTo('objectId', req.query.dc);
    query.equalTo('isActive', true);
    query.first().then(
      discount => {
        res.data.courseDiscount = discount;
        const product = 'course-' + req.query.id;
        if (product === discount.get('productType')) {
          //  if user is logged in - add this discount to userDiscount
          if (req.isAuthenticated()) {
            // check to see if this discount has already been added for this user
            const query = new Parse.Query(UserDiscountModel);
            query.equalTo('userId', req.user._json.user_id);
            query.equalTo('discount', discount);
            query.find().then(
              userDiscount => {
                if (userDiscount.length) return next();
                const addUserDiscount = new UserDiscountModel();
                addUserDiscount.save({
                  userId: req.user._json.user_id,
                  discount: discount,
                  used: 0,
                }).then(
                  () => { return next(); },
                  () => { return next(); }
                );
              });
          } else {
            res.data.discountCode = discount;
            return next();
          }
        } else {
          return next();
        }
      },
      () => {
        return next();
      }
    ).catch(error => {
      // no results
      return next();
    });
  }
}

module.exports = DiscountsService;
