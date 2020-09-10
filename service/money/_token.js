const gateway = require('../../modules/braintree.js');

module.exports = () => {
  return new Promise((resolve, reject) => {
    gateway.clientToken.generate({}, (error, response) => {
      if (error) return reject(error);
      return resolve(response.clientToken);
    });
  });
};
