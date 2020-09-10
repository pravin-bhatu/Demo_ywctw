const Parse = require('../modules/parse.js');

const InstructorService = {};
const InstructorModel = Parse.Object.extend('Instructor');


InstructorService.mwGetInstructorByVanity = (req, res, next) => {
  const query = new Parse.Query(InstructorModel);
  query.equalTo('vanity', req.params.vanity.toLowerCase());
  query.first().then( instructor => {
    res.data.instructor = instructor;
    console.log(instructor.length);
    next();
  }, error => {
    // TODO: Do something with this error.
    console.log(error);
    res.redirect('/');
  }).catch(() => {
    // no results - go to instructors page
    res.redirect('/');
  });
};


module.exports = InstructorService;
