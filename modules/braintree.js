const braintree = require('braintree');

module.exports = braintree.connect({
  environment: (process.env.NODE_ENV === 'production' ? braintree.Environment.Production : braintree.Environment.Sandbox),
  merchantId: process.env.BT_MERCHANT_ID || 'mb9tzddbbb2mk436',
  publicKey: process.env.BT_PUBLIC_KEY || 'sjpszr3mbj2tsftp',
  privateKey: process.env.BT_PRIVATE_KEY || '40160ed37fecf8ed8bc55863e8751558',
});