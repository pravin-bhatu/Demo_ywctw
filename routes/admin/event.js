const express = require('express');
const router = express.Router();

const toMarkdown = require('to-markdown');
const MarkdownIt = require('markdown-it');
const markdown = new MarkdownIt();
const moment = require('moment');

const AdminService = require('../../services/admin/index.js');
const AdminEventService = require('../../services/admin/events.js');
const AdminInstructorsService = require('../../services/admin/instructors.js');

router.use(AdminService.mwGetAdminUser);

// get list of events
router.get('/',
  [
    AdminEventService.mwGetEvents,
  ], (req, res) => {

    res.render('admin/event/index', res.data);
});


router.get('/add',
  [
    AdminInstructorsService.mwGetInstructors,
  ],
  (req, res) => {

    res.data.formType = 'Add';
    res.data.values = {};
    res.render('admin/event/addEvent', res.data);

  });


router.post('/add', (req, res) => {

  const startDate = moment(req.body.eventStartDate, 'YYYY/MM/DD');
  const endDate = moment(req.body.eventEndDate, 'YYYY/MM/DD');

  const startMonth = startDate.format('M');
  const startDay = startDate.format('D');
  const startYear = startDate.format('YYYY');

  const instructor = req.body.instructor.split(',');
  const instructorId = instructor[0];
  const instructorName = instructor[1];
  const nameInitials = instructorName.match(/\b(\w)/g).join('').toLowerCase();

  // TODO: Breakdown location - loction name, location address, location city/state/country/zip, location phone

  // create slug from Course Name
  const eventSlug = nameInitials + '-' + startYear + '-' + startMonth + '-' + startDay + '-' + req.body.eventName.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');

  const markdownDescription = toMarkdown(req.body.eventDescription);

  const eventDetails = {
    instructor: instructorId,
    slug: eventSlug,
    title: req.body.eventName,
    venue: req.body.eventLocationName,
    address: req.body.eventLocationAddress,
    city: req.body.eventLocationCity,
    state: req.body.eventLocationState,
    country: req.body.eventLocationCountry,
    zip: req.body.eventLocationZip,
    startDate: { "__type": "Date", "iso": startDate.toISOString() },
    // stateTime: req.body.startTime,
    endDate: { "__type": "Date", "iso": endDate.toISOString() },
    // startTime:
    // videoId: req.body.videoId,
    // videoProvider: req.body,videoProvider,
    description: markdownDescription,
  }

  const options = {
    type: req.body.formType,
  }

  console.log('Event Details');
  console.log(eventDetails);


  AdminEventService.mwAddUpdateEvent(eventDetails, options, (e, eventId) => {
    if (e) {
      res.redirect('/admin/event/info?eventId=' + eventId);
    } else {
      res.render('admin/event/add', eventDetails);
    }
  });


});


router.post('/edit', (req, res) => {
  res.redirect('/admin/event/');

});


router.get('/info',
  [
    AdminEventService.mwGetEvent,
  ],
  (req, res) => {

    res.render('admin/event/info', res.data);

});


module.exports = router;
