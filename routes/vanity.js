const express = require('express');
const router = express.Router();

const InstructorService = require('../services/instructors.js');
const AmbassadorService = require('../services/ambassador.js');

router.get('/instructor/:vanity',
  [
    InstructorService.mwGetInstructorByVanity,
  ], (req, res) => {

    const instructor = res.data.instructor;
    const instructorUrl = '/instructors/' + instructor.get('username') + '?ref=' + instructor.get('affiliate').id;

    res.redirect(instructorUrl);
  });

router.get('/referred/:vanity',
  [
    AmbassadorService.mwGetAmbassadorByVanity
  ], (req, res) => {
    console.log('REFERRED: ' + JSON.stringify(res.data.ambassador));
    const ambassador = res.data.ambassador;
    const ambassadorUrl = '/' + '?ref=' + ambassador.get('affiliate').id;
  
    res.redirect(ambassadorUrl);
});

module.exports = router;
