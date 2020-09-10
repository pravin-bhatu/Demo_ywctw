exports.registerCallbacks = function registerCallbacks() {
  if (window.clientToken) {
    braintree.setup((window.clientToken), 'dropin', {
      container: 'payment-form',
    });
  }
};
