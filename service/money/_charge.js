const gateway = require('../../modules/braintree');

exports.create = (options) => {
  //console.log('Options :: ' + JSON.stringify(options));
  return new Promise((resolve, reject) => {
    const data = {
      amount: Math.floor(options.amount),
      paymentMethodNonce: options.nonce,
      options: {
        submitForSettlement: true,
      },
      customFields: {
        user_id: options.userId,
        product_type: options.productType || 'course',
        product_id: options.productId || options.courseId,
        partner_code: options.partnerCode,
        user_referred_by: options.userReferredBy ? options.userReferredBy.id : '-',
      },
    };
    console.log('CHARGE DATA :: ' + JSON.stringify(data));
    // Determine if there is an active merchant.
    if (options.instructor && options.instructor.get('merchantStatus') === 'active' && options.instructor.get('merchantId')) {
      // Production
      data.merchantAccountId = options.instructor.get('merchantId');
      // Now determine if the user was referred by an affiliate.
      if (options.user && options.user.get('referredBy')) {
        // Check if the instructor is the affiliate...
        if (options.user.get('referredBy').id === options.instructor.get('affiliate').id) {
          // They get 90% of the money when their own student buys their course.
          data.serviceFeeAmount = Math.floor(data.amount * 0.10);
        } else {
          // We collect our 25% and the 50% that's going to be sent to the affiliate.
          data.serviceFeeAmount = Math.floor(data.amount * 0.75);
        }
      } else {
        // When there's no referral, we take 50%;
        data.serviceFeeAmount = Math.floor(data.amount * 0.50);
      }
    }

    // Make the amounts correct strings.
    data.amount = data.amount + '.00';
    if (data.serviceFeeAmount) data.serviceFeeAmount = data.serviceFeeAmount + '.00';

    gateway.transaction.sale(data, (error, result) => {
      if (error || !result.success){
        console.log("CHARGE ERROR ::" + JSON.stringify(error));
        return reject(error || result.message);
      } else {
        console.log('CHARGE SUCCESS ::' + JSON.stringify(result));
        return resolve(result);
      }
    });
  });
};
