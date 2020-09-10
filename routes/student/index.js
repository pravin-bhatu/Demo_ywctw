var express = require('express');
var router = express.Router();

const Parse = require('../../modules/parse');

const StudentService = require('../../services/student/index.js');
const AdminService = require('../../services/admin/index.js');
 
router.get('/', [AdminService.mwGetVideo,StudentService.mwgetCoursesStatus,StudentService.mwgetRecommendedCourses,StudentService.mwGetCourses,StudentService.mwGetStudentInfo,StudentService.mwgetStudentRegisteredCourses], (req, res) => {
  
   /*** code for getting the video  */
   if (!res.data.files) {
      res.data.files = [];
    }
    res.data.fileId = res.data.files.id;
    res.data.file = res.data.files.get('File');
    let s = res.data.file._url;
    console.log(s);
    let encodedData = Buffer.from(s).toString('base64')
    console.log("RESPONSE BASE64", encodedData);
    res.data.encodedData = encodedData;
    console.log("Data", res.data.encodedData);
  
   res.render('student/index',res.data);
  // if (!req.isAuthenticated()) return res.redirect('/');
  // const query = new Parse.Query(Parse.Object.extend('Enrollment'));
  // query.equalTo('userId', req.user._json.user_id);
  // query.include('course');
  // query.include('course.instructor');
  // query.find().then(enrollments => {
  //   res.data.enrollments = enrollments;
  //   res.data.UserName = currentUserName;
  //   res.render('student/index',res.data);
  // }, error => {
  //   res.data.enrollments = [];
  //   res.data.error = error;
  //   res.render('student/index',res.data);
  // });
});

router.post('/getvoucherinfo',[StudentService.mwgetVoucherStatus,StudentService.mwGetCourseId,StudentService.mwGetCourseName],(req,res)=>{  	
     //console.log(res.data.voucherstatus);   
     console.log(res.data);  
    if(res.data.invalid == 'valid'){
  	   res.send({'coursename':res.data.coursename,'userId':res.data.user.user_id,'courseId':res.data.courseid,'voucherstatus':res.data.voucherstatus});  	
    }
    else{
      res.send({'invalid':res.data.invalid});     
    }
   });

router.post('/addtocourse',[StudentService.mwUpdateVoucherDetails],(req,res)=>{
       //console.log(res.data);
       //console.log(res.data.result);
       //console.log(res.data.error);
       res.send({'result':res.data.result,'error':res.data.error});
});   


router.get('/update_email_password',[StudentService.mwgetUserEmail],(req,res)=>{
       res.render('student/emailpassword',res.data);
});

router.post('/savepassword',[StudentService.mwUpdatePassword],(req,res)=>{
       
   console.log('form submitted!');
   res.redirect('update_email_password');
});


module.exports = router;