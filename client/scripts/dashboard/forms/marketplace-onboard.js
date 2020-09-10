var request = require('superagent');
var _ = require('underscore');

function changeElementState(elements, disabled) {
  _.each(elements, function (element) {
    element.prop('disabled', disabled);
  });
}

module.exports = window.$(document).ready(function () {
  $('#formMarketplaceOnboard').submit(function (event) {
    event.preventDefault();

    // Grab the error elements.
    var errorElements = {
      box: $('#errorBox'),
      text: $('#errorText'),
    };

    // Cache a copy of all form fields.
    var elements = {
      firstName: $('#firstName'),
      lastName: $('#lastName'),
      email: $('#email'),
      phone: $('#phone'),
      dateOfBirth: $('#dateOfBirth'),
      ssn: $('#ssn'),
      streetAddress: $('#streetAddress'),
      city: $('#city'),
      state: $('#state'),
      zip: $('#zip'),
      businessLegal: $('#businessLegal'),
      businessDBA: $('#businessDBA'),
      businessTaxId: $('#businessTaxId'),
      businessStreetAddress: $('#businessStreetAddress'),
      businessCity: $('#businessCity'),
      businessState: $('#businessState'),
      businessZip: $('#businessZip'),
      paymentAccount: $('#paymentAccount'),
      paymentRouting: $('#paymentRouting'),
      tosAccepted: $('#tosAccepted'),
      submitButton: $('#formSubmit'),
    };

    // Disable all fields.
    changeElementState(elements, true);

    var data = _.mapObject(elements, function (element) {
      return element.val();
    });
    data.tosAccepted = elements.tosAccepted.prop('checked');

    // Send the request...
    request.post('/dashboard/marketplace/onboard')
      .send(data)
      .end(function (error, response) {
        if (response.body && response.body.success) {
          errorElements.box.hide();
          window.location.replace('/dashboard');
        } else {
          errorElements.text.html(response.body.error || 'Oops, something went wrong. Please try again.');
          errorElements.box.show();
          changeElementState(elements, false);
        }
        console.log(response);
      });
  });

  $('#amboPayoutDataForm').submit(function (event){
    event.preventDefault();

    // Grab the error elements.
    var errorElements = {
      box: $('#errorBox'),
      text: $('#errorText'),
    };

    // Cache a copy of all form fields.
    var elements = {
      firstName: $('#firstName'),
      lastName: $('#lastName'),
      email: $('#email'),
      phone: $('#phone'),
      dateOfBirth: $('#dateOfBirth'),
      // ssn: $('#ssn'),
      streetAddress: $('#streetAddress'),
      city: $('#city'),
      state: $('#state'),
      zip: $('#zip'),
      paypal: $('#paypal'),
      submitButton: $('#formSubmit')
    };

    // Disable all fields.
    changeElementState(elements, true);

    var data = _.mapObject(elements, function (element) {
      return element.val();
    });
    // data.tosAccepted = elements.tosAccepted.prop('checked');
    request.post('/affiliates/program/onboard')
    .send(data)
    .end(function (error, response) {
      console.log("RESPONSE :: " + JSON.stringify(response));
      if (response.body) {
        errorElements.box.hide();
        alert('Profile Successfully updated')
        window.location.replace('/affiliates/program/profile');
      } else {
        errorElements.text.html('Oops, something went wrong. Please try again.');
        errorElements.box.show();
        changeElementState(elements, false);
      }
      console.log(response);
    });
  });
});
