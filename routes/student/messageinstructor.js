var express = require('express');
var router = express.Router();

const currentUser = require('../../middleware/current_user.js');

const Parse = require('../../modules/parse.js'); 
const formidable = require('express-formidable');

const MessageModel = Parse.Object.extend('Message');
const StudentService = require('../../services/student/index.js');

router.get('/', [StudentService.mwGetCourses,StudentService.mwGetMessage], (req, res) => {
  var instructors = [];
  for (var i = 0; i < res.data.enrollments.length; i++) {
    instructors.push(res.data.enrollments[i].get('course').get('instructor'));
  }
  console.log(instructors);
  res.data.instructors = instructors;
  res.render('student/messageinstructor', res.data);
});



router.post('/', (req, res) => {
  /*
  if (!req.user) {
    return res.redirect('/');
}*/
  console.log('Post The msg to indtructor');
  const msg = req.body.message;
  const instructorId = req.body.to;
  const msgResource = new MessageModel();
  msgResource.set('message',msg);
  msgResource.set('instructor',{"__type":"Pointer","className":"Instructor","objectId":instructorId});
  msgResource.set('user',{"__type":"Pointer","className":"_User","objectId":res.data.currentUser.id});
  msgResource.set('studentId',req.user.id);
  msgResource.save().then(
    () => {
      res.data.result='Message Send to Instructor Successfully!';      
      res.send({'result':res.data.result});
      
    },
    (error) => {      
      res.data.error='Message Sending Failed !';
      res.send({'result':res.data.error});      
    }
  );
});



module.exports = router;