window.$ = window.jQuery = require('jquery');
require('../../bower_components/bootstrap-sass/assets/javascripts/bootstrap');
require('../../bower_components/FitText.js/jquery.fittext.js');

const superagent = require('superagent');

var auth = require('./auth');
var affiliate = require('./affiliate');
var money = require('./money');
var questions = require('./course/questions');
var event = require('./event/main');

var pageHome = require('./pages/home');

// Set affiliate cookie.
affiliate.setReferral();

// Do jQuery dependent things here.
window.$(document).ready(function () {
  // auth.registerCallbacks();

  if( $('#page-home').length ) {
    var x = 0;
    setInterval(function(){
      x-=1;
      $('#page-home').css('background-position', '0 ' + x + 'px');
    }, 40);
  }



  $(function() {
    $('[data-toggle="tooltip"]').tooltip();
  });

  if (window.meta.currentUserId.length) {
    window.analytics.identify(window.meta.currentUserId, {
      name: window.meta.currentUserName.length ? window.meta.currentUserName : null,
      email: window.meta.currentUserEmail.length ? window.meta.currentUserEmail : null,
      authId: window.meta.currentUserAuthId.length ? window.meta.currentUserAuthId : null,
    });
  }

  $('#event-form').submit(function (event) {
    if ($('#event-code').val() !== 'lBzjFKC6Tg') {
      alert('Unauthorized. Please use the code supplied to the mastermind group.');
      return false;
    } else {
      return true;
    }
  });

  //pageHome.scroll.init();
  $('.fittext').fitText(1.25);
  money.registerCallbacks();
  
  // Quiz/Exam - /course/questions.js
  $('#questionsSubmit').on('click', questions.checkQuestions);
  $('#retakeQuiz').on('click', questions.showQuiz);
  
  // Events - /event/main.js
  $('#eventFormSubmit').on('click', event.eventFormSubmit );
  $("input[name='guestOption']").on('click', event.guestForm );

  // Event Nav Bar
  $('#aboutButton').on('click', event.changeEventSection );
  $('#scheduleButton').on('click', event.changeEventSection );
  $('#locationButton').on('click', event.changeEventSection );
  $('#testimonialsButton').on('click', event.changeEventSection );
  $('#bioButton').on('click', event.changeEventSection );

  $('#lessonMarkComplete').on('click', function() {
    console.log('Lesson Marked Complete');
    window.location.href = '/courses/complete/' + $('input[name=courseId]').val() + '/' + $('input[name=lessonId]').val();
  });

  $('#picModal').on('show.bs.modal', function (event) {
    console.log('pic modal click')
    var pic = $(event.relatedTarget) // Button that triggered the modal
    var picurl = pic.data('picurl') // Extract info from data-* attributes
    console.log('picurl :: ' + picurl);
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    // modal.find('.modal-title').text('New message to ' + recipient)
    modal.find('.modal-body img').attr('src', picurl);
  });

});