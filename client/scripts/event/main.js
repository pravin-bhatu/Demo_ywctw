const superagent = require('superagent');


exports.changeEventSection = function(e) {
  $('.event-details').hide();
  console.log(e);

  console.log(this.id);

  if(this.id === 'aboutButton') {
    $('#about').show();
  }

  if(this.id === 'scheduleButton') {
    $('#schedule').show();
  }

  if(this.id === 'locationButton') {
    $('#location').show();
  }

  if(this.id === 'testimonialsButton') {
    $('#testimonials').show();
  }

  if(this.id === 'bioButton') {
    $('#bio').show();
  }

};



exports.eventFormSubmit = function() {

  var submitForm = true;

  console.log('formSubmit');

  if ($('input[id=firstName]').val().length === 0) {
    submitForm = false;
  }
  else if ($('input[id=lastName]').val().length === 0) {
    submitForm = false;
  }
  else if ($('input[id=email]').val().length === 0) {
    submitForm = false;
  }
  else if ($('input[id=phone]').val().length === 0) {
    submitForm = false;
  }
  else if ( $("input[name='guestOption']:checked").val() === 'yesGuest' ) {
    if ($('input[id=guestFirstName]').val().length === 0) {
      submitForm = false;
    } else if ($('input[id=guestLastName]').val().length === 0) {
      submitForm = false;
    } else if ($('input[id=guestEmail]').val().length === 0) {
      submitForm = false;
    }
  }

  var formUser = {};
  formUser.firstName = $('input[id=firstName]').val();
  formUser.lastName = $('input[id=lastName]').val();
  formUser.email = $('input[id=email]').val();
  formUser.phone = $('input[id=phone]').val();
  formUser.phoneType = $('select[name=phoneType]').val();
  formUser.referredBy = $('select[name=referredBy]').val();
  if ($('input[id=allowEmails]').is(':checked')) {
    formUser.allowEmails = true;
  } else {
    formUser.allowEmails = false;
  }

  if (submitForm) {
    $('#freeForm').hide();
    $('#freeFormProcessing').show();
    $('#freeFormError').hide();
    superagent.post('/events/2016-09-ses-free/formSubmit')
      .set('Content-Type', 'application/json')
      .send(formUser)
      .end(function(err, res) {
        if (err) {
          // TODO: Handle this error
          $('#freeFormError').show();
        } else {

          if ( $("input[name='guestOption']:checked").val() === 'yesGuest' ) {
            formUser.firstName = $('input[id=guestFirstName]').val();
            formUser.lastName = $('input[id=guestLastName]').val();
            formUser.email = $('input[id=guestEmail]').val();
            formUser.phone = $('input[id=guestPhone]').val();
            formUser.phoneType = $('select[name=guestPhoneType]').val();
            formUser.referredFirstName = $('input[id=firstName]').val();
            formUser.referredLastName = $('input[id=lastName]').val();
            formUser.refferedEmail = $('input[id=email]').val();
            superagent.post('/events/2016-09-ses-free/formSubmit')
              .set('Content-Type', 'application/json')
              .send(formUser)
              .end(function(err, res) {
                if (err) {
                  // TODO: Handle this error
                  $('#freeFormError').show();
                } else {
                  if (res.body.status === 200) {
                    $('#freeFormProcessing').hide();
                    $('#freeFormPassed').show();
                  }
                }
              });

          } else {
            if (res.body.status === 200) {
              $('#freeFormProcessing').hide();
              $('#freeFormPassed').show();
            }
          }

        }
      });
  } else {
    $('#freeFormError').show();
  }


}

exports.guestForm = function() {

  if ( $("input[name='guestOption']:checked").val() === 'noGuest' ) {
    $('#guestForm').hide();
  } else if ( $("input[name='guestOption']:checked").val() === 'yesGuest' ) {
    $('#guestForm').show();
  }

}
