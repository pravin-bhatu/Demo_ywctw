const express = require('express');
const router = express.Router();

const moment = require('moment');

const DashboardService = require('../../services/dashboard/index.js');
const DashboardPartnerService = require('../../services/dashboard/partner.js');
const voucher_codes = require('../../services/dashboard/voucher_codes.js');

const Parse = require('../../modules/parse');
const Partner = Parse.Object.extend('Partner');
const CourseVoucherInfo = Parse.Object.extend('CourseVoucherInfo');
const VoucherDetails = Parse.Object.extend('VoucherDetails');
CourseTask ={};
CourseInstructor ={};
router.get('/',
  [
    DashboardService.mwGetInstructor,
    DashboardPartnerService.mwGetInstructorPartnerCodes,
    DashboardPartnerService.mwGetInstructorCoursesVoucherInfo,
    DashboardPartnerService.mwGetInstructorCourses,
    DashboardService.mwgetIndividualInstructor,
    DashboardPartnerService.mwgetSingleInstructorCourses,  
    DashboardPartnerService.mwgetSingleVoucherInfo,  
  ], (req, res) => {
    
     //console.log('course info data come here!');
     //console.log(res.data.coursedata);


    /* query to delete the row from the database 
    const VoucherInfo = new Parse.Query(Parse.Object.extend('VoucherDetails'));
    VoucherInfo.equalTo("courseId",'4KrXUg8Lue');
    VoucherInfo.limit(5000);
    VoucherInfo.find({
   success: function(results){
     for(var i = 0; i < results.length; i++)
      {
        console.log(i);
       var result = results[i];
       result.destroy({});
       console.log("Destroy: " + result);
     }
   }
});
   console.log('row destroyed!');
   */
   const devCourses = res.data.courses.filter(course => {
      CourseTask[course.id]=course.get('name');
      CourseInstructor[course.id]=course.get('instructorName');
      return course.get('stage') === 'stage' || course.get('stage') === 'dev';
    });
    const prodCourses = res.data.courses.filter(course => {
      return course.get('stage') === 'prod';
    });
	
	  res.data.prodCourses = prodCourses;
    res.data.devCourses = devCourses;

    res.data.values = {};
    res.data.libs.moment = moment;    
    if(res.data.admin === false){
      res.render('dashboard/vouchersinstructor',res.data);
    }else{
     res.render('dashboard/vouchers', res.data);
    }
});

router.post('/getpromocode',
  [
    DashboardService.mwGetInstructor,
  ], (req, res) => {

    var promoCodes = voucher_codes.generate({
      prefix: "GRPONSCMED-",      
      length: 6,
      pattern:"###-###-###",
      count: req.body.noofpromocode,
      charset: voucher_codes.charset("alphanumeric")
   });

    console.log(promoCodes);


   var date = new Date();
   var expirydate = moment().add(req.body.validity, 'M').format('YYYY/MM/DD');

   const newVoucherCodeInfo = {
    courseId:req.body.courseName,
     VoucherCodeCount:Number(req.body.noofpromocode),
     CreateDate:date,
     ExpiryDate:{ "__type": "Date", "iso": expirydate },
     CreatedBy: 'Admin',          
   }

    // insert code into VoucherInfo Table table
    const newCode = new CourseVoucherInfo();
    newCode.save(newVoucherCodeInfo).then(() => {
    res.data.values = {};

    var addVoucherDetailInfo;        
    console.log(req.body.noofpromocode);
    
    for(var i=0;i<req.body.noofpromocode;i++){  
      console.log('Code:-'+promoCodes[i]);      
      addVoucherDetailInfo ={
           courseId:req.body.courseName,
           VoucherCode:promoCodes[i],
           Status:'Available',
           CreateDate:date,
           Expirydate:{ "__type": "Date", "iso": expirydate },
           CreatedBy:'Admin'
        }

   const VoucherInfo = new VoucherDetails();
   VoucherInfo.save(addVoucherDetailInfo);
  }
  
  res.redirect('/dashboard/vouchers');
}, error => {
  console.log('error' + JSON.stringify(error));
  console.log('error.message :: ' + error.message);
  //res.data.values = newPartnerCode;
  res.redirect('/dashboard/vouchers');
});

res.redirect('/dashboard/vouchers');


  });

module.exports = router;
