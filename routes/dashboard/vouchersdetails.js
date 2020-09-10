const express = require('express');
const router = express.Router();

const moment = require('moment');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const DashboardCourseService = require('../../services/dashboard/course.js');


const Parse = require('../../modules/parse');
const Partner = Parse.Object.extend('Partner');
const CourseVoucherInfo = Parse.Object.extend('CourseVoucherInfo');
const VoucherDetails = Parse.Object.extend('VoucherDetails');
CourseTask ={};


router.get('/:courseid',[
DashboardCourseService.mwGetCourseName,
DashboardCourseService.mwGetVoucherInfo,
DashboardCourseService.mwGetVoucherAvailable,
DashboardCourseService.mwGetVoucherRedeem,
],(req, res) => {  
      
      console.log('hello');
    
		console.log(req.params);		
		console.log(req.params.courseid);	
		res.data.libs.moment = moment;
        res.render('dashboard/vouchersdetails',res.data);
        
});


router.get('/:courseid/downloadcsv',[
DashboardCourseService.mwGetCourseName,
DashboardCourseService.mwGetCSVDownload,
],(req,res) =>{
	
	  console.log(res.data.vouchers);	 
	  var myVouchers = res.data.vouchers;	  
	  console.log(myVouchers.length);
	  var vouchersLength=myVouchers.length;

	  const csvWriter = createCsvWriter({
	  path: 'VoucherDetails.csv',
		header: [
		{id: 'vouchercode', title: 'Voucher Code'},		
		{id: 'courseid', title: 'Linked Course'},		
		{id: 'crdate', title: 'Created Date'},
		{id: 'expdate', title: 'Expiry Date'},
		{id: 'createdby', title: 'Created By'},
		{id: 'voucherstatus', title: 'Status'},
		{id: 'redeemby', title: 'Redeem By (Name)'},
		{id: 'emailid', title: 'Email ID'},
		{id: 'zipcode', title: 'Zip Code'},
		{id: 'Phone', title: 'Phone No.'},       		
	   ]
});

    const data=[];		
	 for(var i=0;i<vouchersLength;i++){		
		 var MyObj={};
		 //res.data.libs.moment = moment;	  
		 MyObj.vouchercode=myVouchers[i].get('VoucherCode');
		 MyObj.courseid=CourseTask[myVouchers[i].get('courseId')];
		 MyObj.crdate=moment(myVouchers[i].get('CreateDate')).format("MMMM Do YYYY");
		 MyObj.expdate=moment(myVouchers[i].get('Expirydate')).format("MMMM Do YYYY");
		 MyObj.createdby=myVouchers[i].get('CreatedBy');
		 MyObj.voucherstatus=myVouchers[i].get('Status');
		 MyObj.redeemby=myVouchers[i].get('Redeem_by');
		 MyObj.emailid=myVouchers[i].get('EmailId');
		 MyObj.zipcode=myVouchers[i].get('ZipCode');
		 MyObj.phone=myVouchers[i].get('PhoneNo');
		 data.push(MyObj);
	 }	
	
	csvWriter.writeRecords(data).then(() => res.download('VoucherDetails.csv'));	 
	console.log('csv download complete!');
	
	
});


  function downloadcsv(file){
		 res.download(file);
     }
     
  
module.exports = router;
