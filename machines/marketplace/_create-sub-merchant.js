const braintree = require('../../modules/braintree.js');

module.exports = function createSubMerchant(data) {
  data.masterMerchantAccountId = process.env.MASTER_MERCHANT_ID || 'youwillchangetheworld';

  return new Promise((resolve, reject) => {
    braintree.merchantAccount.create(data, (error, result) => {
      if (error) return reject(error.name);
      if (!result.success) return reject(result.message);
      return resolve(result);
    });
  });
};
