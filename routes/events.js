const express = require('express');
const router = express.Router();

const surveyService = require('../services/survey');

const EventService = require('../services/event.js');

const MarkdownIt = require('markdown-it');
const markdown = new MarkdownIt();
const moment = require('moment');

const superagent = require('superagent');

const Parse = require('../modules/parse');
const Beyond = Parse.Object.extend('FreeTickets');

/* GET home page. */
router.get('/', (req, res) => {
  res.data.currentUrl='/events';
  res.render('events/index', res.data);
});

router.get('/index2', (req, res) => {
  res.render('events/index-2', res.data);
});

router.get('/new-event-page', (req, res) => {
  res.data.meta.title = 'The Personal Branding Mastermind | Sept. 17th - 20th, 2016';
  res.data.meta.og.title = 'The Personal Branding Mastermind | Sept. 17th - 20th, 2016';
  res.data.meta.og.description = 'Join us for The Personal Branding Mastermind, Sept. 17th - 20th, 2016, at the IPEC center in Las Vegas.';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/sept-header.png'
  res.render('events/new-event-page', res.data);
});

router.get('/survey', (req, res) => {
  res.render('events/survey', res.data);
});

router.post('/survey', (req, res) => {
  res.render('events/surveyThankYou', res.data);
});

router.get('/london-orders', (req, res) => {
  res.render('events/orders-london', res.data);
});

router.get('/pre-event-questionnaire', (req, res) => {
  res.render('events/pre-event-questionnaire', res.data);
});

router.post('/pre-event-questionnaire', (req, res) => {
  console.log('In the POST of the questionnaire');

  // Get Data from post
  const questions = [];
  const question1 = {
    "orderBy": "1",
    "question" : req.body.q1,
    "answer" : req.body.question1,
  }
  questions.push(question1);

  const question2 = {
    "orderBy": "2",
    "question" : req.body.q2,
    "answer" : req.body.question2,
  }
  questions.push(question2);

  const question3 = {
    "orderBy": "3",
    "question" : req.body.q3,
    "answer" : req.body.question3,
  }
  questions.push(question3);

  const question4 = {
    "orderBy": "4",
    "question" : req.body.q4,
    "answer" : req.body.question4,
  }
  questions.push(question4);

  const question5 = {
    "orderBy": "5",
    "question" : req.body.q5,
    "answer" : req.body.question5,
    "other" : req.body.question5_other,
  }
  questions.push(question5);

  const question5a = {
    "orderBy": "5a",
    "question" : req.body.q5a,
    "answers" : {
      "facebook" : req.body.facebookCount,
      "twitter" : req.body.twitterCount,
      "youTube" : req.body.youTubeCount,
      "instagram" : req.body.instagramCount,
      "blogCount" : req.body.blogCount,
      "linkedIn" : req.body.linkedInCount,
    },
  }
  questions.push(question5a);

  const question6 = {
    "orderBy": "6",
    "question" : req.body.q6,
    "answer" : req.body.question6,
  }
  questions.push(question6);

  const question7 = {
    "orderBy": "7",
    "question" : req.body.q7,
    "answer" : req.body.question7,
    "other" : req.body.question7_other,
  }
  questions.push(question7);

  const question8 = {
    "orderBy": "8",
    "question" : req.body.q8,
    "answer" : req.body.question8,
    "other" : req.body.question8_other,
  }
  questions.push(question8);

  const question9 = {
    "orderBy": "9",
    "question" : req.body.q9,
    "answer" : req.body.question9,
  }
  questions.push(question9);

  const question10 = {
    "orderBy": "10",
    "question" : req.body.q10,
    "answer" : req.body.question10,
  }
  questions.push(question10);

  const question11 = {
    "orderBy": "11",
    "question" : req.body.q11,
    "answer" : req.body.question11,
  }
  questions.push(question11);

  const question12 = {
    "orderBy": "12",
    "question" : req.body.q12,
    "answer" : req.body.question12,
  }
  questions.push(question12);

  const question13 = {
    "orderBy": "13",
    "question" : req.body.q13,
    "answer" : req.body.question13,
  }
  questions.push(question13);

  const question14 = {
    "orderBy": "14",
    "question" : req.body.q14,
    "answer" : req.body.question14,
  }
  questions.push(question14);

  const questionnaire = {
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    questionnaireId: req.body.questionnaireId,
    questionnaireName: req.body.questionnaireName,
    questions : questions,
  }

  console.log('Questions');
  console.log(questions);
  console.log('Questionnaire');
  console.log(JSON.stringify(questionnaire));


  // Insert into DB
  const EventPreQuestions = Parse.Object.extend('EventPreQuestions');
  const preQuestions = new EventPreQuestions();
  preQuestions.save(questionnaire).then( response => {
    console.log('Success');
    console.log(response);
  }, error => {
    console.log('Error');
    console.log(error);
  });

  const questionnaireCRM = {
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    questionnaireId: req.body.questionnaireId,
    questionnaireName: req.body.questionnaireName,
    q1Answer: req.body.question1,
    q2Answer: req.body.question2,
    q3Answer: req.body.question3,
    q4Answer: req.body.question4,
    q5Answer: req.body.question5,
    q6Answer: req.body.question6,
    q7Answer: req.body.question7,
    q8Answer: req.body.question8,
    q9Answer: req.body.question9,
    q10Answer: req.body.question10,
    q11Answer: req.body.question11,
    q12Answer: req.body.question12,
    q13Answer: req.body.question13,
    q14Answer: req.body.question14,
    facebookFollowers : req.body.facebookCount,
    twitterFollowers : req.body.twitterCount,
    youTubeFollowers : req.body.youTubeCount,
    instagramFollowers : req.body.instagramCount,
    blogCountFollowers : req.body.blogCount,
    linkedInFollowers : req.body.linkedInCount,
  }

  // Zapier webhook https://hooks.zapier.com/hooks/catch/1294668/6b37qj/

  superagent.post('https://hooks.zapier.com/hooks/catch/1294668/6b37qj/')
    .set('Content-Type', 'application/json')
    .send(questionnaireCRM)
    .end(function(err, res) {
      if (err) {
        // TODO: Handle this error
        console.log('SuperAgent Error :: ' + err);
      } else {
        console.log('Form submitted');
      }
    });

  
  res.render('events/surveyThankYou', res.data);

});



router.get('/2016-05-a-bug-free-mind-las-vegas', (req, res) => {
  const RSVP = Parse.Object.extend('RSVP');
  const Event = Parse.Object.extend('Event');

  const event = new Event();
  event.id = 'g7F7NCyYyC';

  const query = new Parse.Query(RSVP);
  query.equalTo('event', event);
  query.find().then(
    rsvps => {
      res.data.open = rsvps.length < 63;
      res.render('events/2016-05-a-bug-free-mind-las-vegas', res.data);
    },
    () => {
      res.render('events/2016-05-a-bug-free-mind-las-vegas', res.data);
    }
  );
});

router.get('/2016-05-social-entrepreneur-summit-las-vegas', (req, res) => {
  res.data.open = true;
  res.render('events/social-entrepreneur-summit', res.data);
});

router.post('/2016-05-a-bug-free-mind-las-vegas', (req, res) => {
  const Event = Parse.Object.extend('Event');
  const event = new Event();
  event.id = 'g7F7NCyYyC';
  const userId = req.user ? req.user._json.user_id : null;

  const RSVP = Parse.Object.extend('RSVP');
  const rsvp = new RSVP();
  rsvp.save({
    userId: userId,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    shirtGender: req.body.shirtGender,
    shirtSize: req.body.shirtSize,
    event: event,
  }).then(
    () => {
      res.redirect('/events/2016-05-a-bug-free-mind-las-vegas/thank-you');
    },
    () => {
      res.redirect('back');
    }
  );
});

router.get('/2016-05-a-bug-free-mind-las-vegas/thank-you', (req, res) => {
  res.render('events/thank-you', res.data);
});

router.post('/2016-07-social-entrepreneur-summit-las-vegas/formSubmit', (req, res) => {

  superagent.post('https://hooks.zapier.com/hooks/catch/1294668/uwpw8r/')
    .set('Content-Type', 'application/json')
    .send(req.body)
    .end(function(err, response) {
      if (err) {
        res.send(err);
      } else {
        res.send(response);
      }
    });
});
//2018-08-affiliate-marketing-summit-las-vegas
router.get('/affiliate-marketing-summit', (req, res) => {
  res.render('events/affiliate-marketing-summit', res.data);
});
router.get('/million-dollar-blueprint', (req, res) => {
  res.render('events/million-dollar-blueprint', res.data);
});

router.get('/2016-07-social-entrepreneur-summit-las-vegas', (req, res) => {
  res.render('events/2016-07-social-entrepreneur-summit', res.data);
});

router.get('/2016-07-ses-free', (req, res) => {

  res.render('events/2016-07-ses-free', res.data);
});

router.post('/2016-07-ses-free/formSubmit', (req, res) => {

  superagent.post('https://hooks.zapier.com/hooks/catch/1294668/uwpw8r/')
    .set('Content-Type', 'application/json')
    .send(req.body)
    .end(function(err, response) {
      if (err) {
        res.send(err);
      } else {
        res.send(response);
      }
    });

});

router.get('/2016-09-social-entrepreneur-summit-las-vegas', (req, res) => {
  res.redirect('/events/2016-09-personal-branding-summit-las-vegas');
});

router.get('/2016-09-personal-branding-summit-las-vegas', (req, res) => {
  res.redirect('/events/2016-09-personal-branding-mastermind-las-vegas');
});


router.get('/2016-09-personal-branding-mastermind-las-vegas', (req, res) => {
  res.data.meta.title = 'The Personal Branding Mastermind | Sept. 17th - 20th, 2016';
  res.data.meta.og.title = 'The Personal Branding Mastermind | Sept. 17th - 20th, 2016';
  res.data.meta.og.description = 'Join us for The Personal Branding Mastermind, Sept. 17th - 20th, 2016, at the IPEC center in Las Vegas.';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/sept-header.png'
  res.render('events/2016-09-personal-branding-mastermind', res.data);
});

router.get('/2016-09-ses-free', (req, res) => {

  res.data.meta.title = 'The Personal Branding Mastermind | Sept. 17th - 20th, 2016';
  res.data.meta.og.title = 'The Personal Branding Mastermind | Sept. 17th - 20th, 2016';
  res.data.meta.og.description = 'Join us for The Personal Branding Mastermind, Sept. 17th - 20th, 2016, at the IPEC center in Las Vegas.';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/sept-header.png'
  res.render('events/2016-09-ses-free', res.data);
});

router.post('/2016-09-ses-free/formSubmit', (req, res) => {

  superagent.post('https://hooks.zapier.com/hooks/catch/1294668/uwpw8r/')
    .set('Content-Type', 'application/json')
    .send(req.body)
    .end(function(err, response) {
      if (err) {
        res.send(err);
      } else {
        res.send(response);
      }
    });

});

router.get('/2016-10-social-entrepreneur-summit-london', (req, res) => {
  res.render('events/2016-10-social-entrepreneur-summit', res.data);
});

router.get('/events-lv', (req, res) => {
  res.render('events/events-lv', res.data);
});

router.get('/events-ny', (req, res) => {
  res.render('events/events-ny', res.data);
});

router.get('/events-uk', (req, res) => {
  res.render('events/events-uk', res.data);
});

router.get('/events-dublin', (req, res) => {
  res.render('events/events-dublin', res.data);
});

// 6-15-16 new events
router.get('/2017-07-lv-nuclear-marketing-mastermind', (req, res) => {
  res.render('events/2017-07-lv-nuclear-marketing-mastermind', res.data);
});

router.get('/2017-08-lv-nuclear-marketing-mastermind', (req, res) => {
  res.render('events/2017-08-lv-nuclear-marketing-mastermind', res.data);
});

router.get('/2017-09-lv-nuclear-marketing-mastermind', (req, res) => {
  res.render('events/2017-09-lv-nuclear-marketing-mastermind', res.data);
});

// 2017 Las Vegas Events
router.get('/2017-04-lv-mastermind', (req, res) => {
  res.data.meta.title = 'Building Online Courses Live Mastermind | April 1st - 2nd, 2017 | Las Vegas, NV';
  res.data.meta.og.title = 'Building Online Courses Live Mastermind | April 1st - 2nd, 2017 | Las Vegas, NV';
  res.data.meta.og.description = 'Join Us April 1st - 2nd, 2017 in Las Vegsa, NV for our "Building Online Courses Live Mastermind"';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/tour-card.png'
  res.render('events/2017-04-lv-mastermind', res.data);
});

router.get('/2017-05-lv-mastermind', (req, res) => {
  res.data.meta.title = 'Building Online Courses Live Mastermind | May 20th - 21st, 2017 | Las Vegas, NV';
  res.data.meta.og.title = 'Building Online Courses Live Mastermind | May 20th - 21st, 2017 | Las Vegas, NV';
  res.data.meta.og.description = 'Join Us May 20th - 21st, 2017 in Las Vegsa, NV for our "Building Online Courses Live Mastermind"';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/tour-card.png'
  res.render('events/2017-05-lv-mastermind', res.data);
});

router.get('/2017-06-lv-mastermind', (req, res) => {
  res.data.meta.title = 'Building Online Courses Live Mastermind | June 17th - 18th, 2017 | Las Vegas, NV';
  res.data.meta.og.title = 'Building Online Courses Live Mastermind | June 17th - 18th, 2017 | Las Vegas, NV';
  res.data.meta.og.description = 'Join Us June 17th - 18th, 2017 in Las Vegsa, NV for our "Building Online Courses Live Mastermind"';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/tour-card.png'
  res.render('events/2017-06-lv-mastermind', res.data);
});

router.get('/2017-09-lv-mastermind', (req, res) => {
  res.data.meta.title = 'Building Online Courses Live Mastermind | September 16th - 17th, 2017 | Las Vegas, NV';
  res.data.meta.og.title = 'Building Online Courses Live Mastermind | September 16th - 17th, 2017 | Las Vegas, NV';
  res.data.meta.og.description = 'Join Us September 16th - 17th, 2017 in Las Vegsa, NV for our "Building Online Courses Live Mastermind"';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/tour-card.png'
  res.render('events/2017-09-lv-mastermind', res.data);
});

router.get('/2017-10-lv-mastermind', (req, res) => {
  res.data.meta.title = 'Building Online Courses Live Mastermind | October 21st - 22nd, 2017 | Las Vegas, NV';
  res.data.meta.og.title = 'Building Online Courses Live Mastermind | October 21st - 22nd, 2017 | Las Vegas, NV';
  res.data.meta.og.description = 'Join Us October 21st - 22nd, 2017 in Las Vegsa, NV for our "Building Online Courses Live Mastermind"';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/tour-card.png'
  res.render('events/2017-10-lv-mastermind', res.data);
});

router.get('/2017-11-lv-mastermind', (req, res) => {
  res.data.meta.title = 'Building Online Courses Live Mastermind | November 18th - 19th, 2017 | Las Vegas, NV';
  res.data.meta.og.title = 'Building Online Courses Live Mastermind | November 18th - 19th, 2017 | Las Vegas, NV';
  res.data.meta.og.description = 'Join Us November 18th - 19th, 2017 in Las Vegsa, NV for our "Building Online Courses Live Mastermind"';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/tour-card.png'
  res.render('events/2017-11-lv-mastermind', res.data);
});

router.get('/2017-12-lv-mastermind', (req, res) => {
  res.data.meta.title = 'Building Online Courses Live Mastermind | December 9th - 10th, 2017 | Las Vegas, NV';
  res.data.meta.og.title = 'Building Online Courses Live Mastermind | December 9th - 10th, 2017 | Las Vegas, NV';
  res.data.meta.og.description = 'Join Us December 9th - 10th, 2017 in Las Vegsa, NV for our "Building Online Courses Live Mastermind"';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/tour-card.png'
  res.render('events/2017-12-lv-mastermind', res.data);
});


// 2017 New York Events
router.get('/2017-06-ny-mastermind', (req, res) => {
  res.data.meta.title = 'Building Online Courses Live Mastermind | June 10th - 11th, 2017 | New York, NY';
  res.data.meta.og.title = 'Building Online Courses Live Mastermind | June 10th - 11th, 2017 | New York, NY';
  res.data.meta.og.description = 'Join Us June 10th - 11th, 2017 in New York, NY for our "Building Online Courses Live Mastermind"';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/tour-card.png'
  res.render('events/2017-06-ny-mastermind', res.data);
});

router.get('/2017-11-ny-mastermind', (req, res) => {
  res.data.meta.title = 'Building Online Courses Live Mastermind | October 7th - 8th, 2017 | New York, NY';
  res.data.meta.og.title = 'Building Online Courses Live Mastermind | October 7th - 8th, 2017 | New York, NY';
  res.data.meta.og.description = 'Join Us October 7th - 8th, 2017 in New York, NY for our "Building Online Courses Live Mastermind"';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/tour-card.png'
  res.render('events/2017-11-ny-mastermind', res.data);
});


// 2017 London Events
router.get('/2017-02-uk-mastermind', (req, res) => {
  res.data.meta.title = 'Building Online Courses Live Mastermind | February 18th - 19th, 2017 | London, UK';
  res.data.meta.og.title = 'Building Online Courses Live Mastermind | February 18th - 19th, 2017 | London, UK';
  res.data.meta.og.description = 'Join Us February 18th - 19th, 2017 in London, UK for our "Building Online Courses Live Mastermind"';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/tour-card.png'
  res.render('events/2017-02-uk-mastermind', res.data);
});

router.get('/2017-03-uk-mastermind', (req, res) => {
  res.data.meta.title = 'Building Online Courses Live Mastermind | March 18th - 19th, 2017 | London, UK';
  res.data.meta.og.title = 'Building Online Courses Live Mastermind | March 18th - 19th, 2017 | London, UK';
  res.data.meta.og.description = 'Join Us March 18th - 19th, 2017 in London, UK for our "Building Online Courses Live Mastermind"';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/tour-card.png'
  res.render('events/2017-03-uk-mastermind', res.data);
});

router.get('/2017-03-uk-purchased-thankyou', (req, res) => {
  res.render('events/2017-03-uk-purchased-thankyou', res.data);
});

router.get('/2017-05-uk-mastermind', (req, res) => {
  res.data.meta.title = 'Building Online Courses Live Mastermind | May 6th - 7th, 2017 | London, UK';
  res.data.meta.og.title = 'Building Online Courses Live Mastermind | May 6th - 7th, 2017 | London, UK';
  res.data.meta.og.description = 'Join Us May 6th - 7th, 2017 in London, UK for our "Building Online Courses Live Mastermind"';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/tour-card.png'
  res.render('events/2017-05-uk-mastermind', res.data);
});

router.get('/2017-06-uk-mastermind', (req, res) => {
  res.data.meta.title = 'Building Online Courses Live Mastermind | June 24th - 25th, 2017 | London, UK';
  res.data.meta.og.title = 'Building Online Courses Live Mastermind | June 24th - 25th, 2017 | London, UK';
  res.data.meta.og.description = 'Join Us June 24th - 25th, 2017 in London, UK for our "Building Online Courses Live Mastermind"';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/tour-card.png'
  res.render('events/2017-06-uk-mastermind', res.data);
});

router.get('/2017-09-uk-mastermind', (req, res) => {
  res.data.meta.title = 'Building Online Courses Live Mastermind | September 9th - 10th, 2017 | London, UK';
  res.data.meta.og.title = 'Building Online Courses Live Mastermind | September 9th - 10th, 2017 | London, UK';
  res.data.meta.og.description = 'Join Us September 9th - 10th, 2017 in London, UK for our "Building Online Courses Live Mastermind"';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/tour-card.png'
  res.render('events/2017-09-uk-mastermind', res.data);
});

router.get('/2017-10-uk-mastermind', (req, res) => {
  res.data.meta.title = 'Building Online Courses Live Mastermind | October 14th - 15th, 2017 | London, UK';
  res.data.meta.og.title = 'Building Online Courses Live Mastermind | October 14th - 15th, 2017 | London, UK';
  res.data.meta.og.description = 'Join Us October 14th - 15th, 2017 in London, UK for our "Building Online Courses Live Mastermind"';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/tour-card.png'
  res.render('events/2017-10-uk-mastermind', res.data);
});

router.get('/2017-12-uk-mastermind', (req, res) => {
  res.data.meta.title = 'Building Online Courses Live Mastermind | December 2nd - 3rd, 2017 | London, UK';
  res.data.meta.og.title = 'Building Online Courses Live Mastermind | December 2nd - 3rd, 2017 | London, UK';
  res.data.meta.og.description = 'Join Us December 2nd - 3rd, 2017 in London, UK for our "Building Online Courses Live Mastermind"';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/tour-card.png'
  res.render('events/2017-12-uk-mastermind', res.data);
});



router.get('/2016-11-personal-branding-mastermind-las-vegas', (req, res) => {
  res.data.meta.title = 'The Personal Branding Mastermind | Nov. 12th - 14th, 2016';
  res.data.meta.og.title = 'The Personal Branding Mastermind | Nov. 12th - 14th, 2016';
  res.data.meta.og.description = 'Join us for The Personal Branding Mastermind, Nov. 12th - 14th, 2016, at the IPEC center in Las Vegas.';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/nov-header.png'
  res.render('events/2016-11-personal-branding-mastermind', res.data);
});

router.get('/building-online-courses-live-mastermind', (req, res) => {
  res.data.meta.title = 'Building Online Courses Live Mastermind';
  res.data.meta.og.title = 'Building Online Courses Live Mastermind';
  res.data.meta.og.description = 'Check out our dates to find the next "Building Online Courses Live Mastermind" in your area.';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/tour-card.png'
  res.render('events/building-online-courses-live-mastermind', res.data);
});

router.get('/2016-12-ut-building-online-courses-live-mastermind', (req, res) => {
  res.data.meta.title = 'Online Course Creation Mastermind - St. George, UT, Dec. 9th - 10th, 2016';
  res.data.meta.og.title = 'Online Course Creation Mastermind - St. George, UT, Dec. 9th - 10th, 2016';
  res.data.meta.og.description = 'Online Course Creation Mastermind, St. George, UT, Dec. 9th - 10th, 2016.';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/utah-event-card.png'
  res.render('events/2016-12-ut-building-online-courses-live-mastermind', res.data);

});

router.get('/go-beyond-the-game', (req, res) => {
  res.data.showForm = true;
  res.data.showThankYou = false;

  res.data.meta.title = 'Go Beyond The Game';
  res.data.meta.og.title = 'Go Beyond The Game';
  res.data.meta.og.description = 'Meet former Michigan star and NBA small forward Bernard Robinson Jr. film his upcoming course. | Nov. 27th, 2016';
  res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/go-beyond-card.png'
  res.render('events/go-beyond-the-game', res.data);

});

router.get('/2017-uk-online-course-creation-mastermind', (req, res) => {
  res.data.meta.title = 'Building Online Courses Live Mastermind';
  res.data.meta.og.title = 'Building Online Courses Live Mastermind';
  res.data.meta.og.description = 'Check out our dates to find the next "Building Online Courses Live Mastermind" in your area.';
  // res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/nov-header.png'
  res.render('events/2017-uk-online-course-creation-mastermind', res.data);
});

router.get('/2017-ny-online-course-creation-mastermind', (req, res) => {
  res.data.meta.title = 'Building Online Courses Live Mastermind';
  res.data.meta.og.title = 'Building Online Courses Live Mastermind';
  res.data.meta.og.description = 'Check out our dates to find the next "Building Online Courses Live Mastermind" in your area.';
  // res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/nov-header.png'
  res.render('events/2017-ny-online-course-creation-mastermind', res.data);
});

router.get('/2017-lv-online-course-creation-mastermind', (req, res) => {
  res.data.meta.title = 'Building Online Courses Live Mastermind';
  res.data.meta.og.title = 'Building Online Courses Live Mastermind';
  res.data.meta.og.description = 'Check out our dates to find the next "Building Online Courses Live Mastermind" in your area.';
  // res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/nov-header.png'
  res.render('events/2017-lv-online-course-creation-mastermind', res.data);
});

router.get('/2017-dublin-online-course-creation-mastermind', (req, res) => {
  res.data.meta.title = 'Building Online Courses Live Mastermind';
  res.data.meta.og.title = 'Building Online Courses Live Mastermind';
  res.data.meta.og.description = 'Check out our dates to find the next "Building Online Courses Live Mastermind" in your area.';
  // res.data.meta.og.image = 'https://www.youwillchangetheworld.com/img/event/HHH8BSLNfV/nov-header.png'
  res.render('events/2017-dublin-online-course-creation-mastermind', res.data);
});

router.post('/register', (req, res) => {
  res.data.showForm = false;
  res.data.showThankYou = true;

  const beyondData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    guests: Number(req.body.guests),
  }

  console.log('Registration Data');
  console.log(beyondData);

  const beyond = new Beyond();
  beyond.save(beyondData).then(() => {
    //res.redirect('settings?success=true');
    res.render('events/go-beyond-the-game', res.data);
  }, error => {
    console.log("Error :: " + JSON.stringify(error));
    res.render('events/go-beyond-the-game', res.data);
  });
});

router.get('/press-release-intake-form', (req, res) => {
  res.render('events/press-release-intake-form', res.data);
});

router.post('/submitPR', (req, res) => {

  let prData = {
    topic: req.body.topic,
    headline: req.body.headline,
    summary: req.body.summary,
    quote: req.body.quote,
    quoteAuthor: req.body.quoteAuthor,
    body: req.body.body,
    videoURL: req.body.videoURL,
    videoScript: req.body.videoScript,
    caption1: req.body.caption1,
    caption2: req.body.caption2,
    caption3: req.body.caption3,
    caption4: req.body.caption4,
    releaseDate: req.body.releaseDate,
    keywords: req.body.keywords,
    industry: req.body.industry,
    zip: req.body.zip,
    fullName: req.body.fullName,
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.address,
    brandName: req.body.brandName,
    brandWebsite: req.body.brandWebsite,
    twitter: req.body.twitter,
    facebook: req.body.facebook,
    linkedin: req.body.linkedin,
    google: req.body.google,
    rss: req.body.rss,
  }

  console.log(prData);
  
  res.render('events/press-release-intake-form', res.data);
});


router.get('/:slug',
  [
    EventService.mwGetEventBySlug,
  ], (req, res) => {

    console.log(res.data.event);
    console.log(res.data.event.get('title'));

    res.data.formatDate = moment(res.data.event.get('startDate')).format('MMMM DD YYYY');

    res.data.libs.markdown = markdown;

    res.render('events/event', res.data);
});


module.exports = router;
