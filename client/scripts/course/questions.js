const superagent = require('superagent');

exports.showQuiz = function() {
  $('#retakeQuiz').hide();
  $('#quizPassed').hide();
  $('#quiz').show();

}

exports.checkQuestions = function() {
  $('#questionsSubmit').prop('disabled', true);
  $('#questionsError').hide();
  $('#questionsProcessing').hide();
  $('#questionsFailed').hide();
  $('#questionsPassed').hide();
  
  var questions = {};
  questions.courseId = $('input[name=courseId]').val();
  questions.lessonId = $('input[name=lessonId]').val();
  questions.questionType = $('input[name=questionType]').val();

  if(questions.questionType === 'exam') {
    $('html, body').animate({ scrollTop: 0 }, 'fast');
  }

  var radios = $(':radio');

  var radioArray = [];
  $.each(radios, function(i) {
    if($.inArray(radios[i].name, radioArray) === -1) {
      radioArray.push(radios[i].name);
    }
  });

  var answers = [];
  var submitAnswers = true;
  $.each(radioArray, function(i) {
    if ($('input[name=' + radioArray[i] + ']:checked').val() !== undefined) {
      var answerObj = {};
      answerObj[radioArray[i]] = $('input[name=' + radioArray[i] + ']:checked').val();
      answers.push(answerObj);
    } else {
      submitAnswers = false;
      $('#questionsError').show();
      $('#questionsSubmit').prop('disabled', false);
    }
  });

  questions.answers = answers;

  if (submitAnswers) {
    $('#questionsError').hide();
    $('#questionsProcessing').show();
    superagent.post('/courses/checkAnswers')
      .set('Content-Type', 'application/json')
      .send(questions)
      .end(function(err, res){
        $('#questionsProcessing').hide();
        $('#questionsSubmit').prop('disabled', false);
        if (err) {
          // TODO: Handle this error
        } else {
          $('#lessonMarkComplete').prop('disabled', false);
          if (res.body.score === res.body.questions) {
            $('#questionsPassed').show();
          } else {
            const resultPercent = Math.round((res.body.score / res.body.questions) * 100);
            $('#questionsFailed').html(resultPercent + '% - You got ' + res.body.score + ' out of ' + res.body.questions + ' correct').show();
          }
        }
      });
  }
};