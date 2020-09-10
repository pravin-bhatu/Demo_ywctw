const Parse = require('../../modules/parse.js');

const moment = require('moment');
const MessageModel = Parse.Object.extend('Message');
const StudentModel = Parse.Object.extend('User');
const VoucherModel = Parse.Object.extend('VoucherDetails');
const CourseModel  = Parse.Object.extend('Course'); 
const EnrollmentModel = Parse.Object.extend('Enrollment');

var genre=[];
CourseStatus={};
class StudentService {

	static mwGetCourses(req, res, next) {
		if (!req.user) {
			return res.redirect('/');
		}
		const query = new Parse.Query(Parse.Object.extend('Enrollment'));
		query.equalTo('userId', req.user._json.user_id);
		query.ascending("completed");
		query.include('course');
		query.include('course.instructor');
		query.find().then(enrollments => {
			res.data.enrollments = enrollments;
			return next();
		}, error => {
			res.data.enrollments = [];
			res.data.error = error;
			return next();
		});
	}
    static mwgetCoursesStatus(req,res,next){
		var completecourse=0;
        console.log('inside course Status');
		const query = new Parse.Query(Parse.Object.extend('Enrollment'));
		query.equalTo('userId', req.user._json.user_id);
		query.include('course');
		query.include('course.lesson');
		query.include('lesson');		
		query.find().then(result=>{
			  
		  //console.log(result);
    		result.forEach(rm=>{
			   console.log('course name');	
			   console.log(rm.get('course').get('name'));
			   //console.log(rm.get('course').get('id'));
		   
			   
			   //counting the lessons in a course
			   var lessoncount=rm.get('course').get('lessons').length;

			   // getting the complete array from the enrollment table
			   var completecount=rm.get('completed').length;
			   
			   console.log('lesson count'+lessoncount);
			   console.log('complete count'+completecount);

               if(completecount == 0 ){
				CourseStatus[rm.get('course').get('name')]='New';
			   }else if(completecount !=0 && completecount < lessoncount)
			   {
				CourseStatus[rm.get('course').get('name')]='InCompleted'; 
			   }else{
				CourseStatus[rm.get('course').get('name')]='Completed';
				completecourse++;
			   }

			   
			   /*
			   if(completecount == lessoncount){
				CourseStatus[rm.get('course').get('name')]='Completed';
			   }else if(completecount<lessoncount){
				CourseStatus[rm.get('course').get('name')]='InCompleted';   
			   }else if(completecount == 0){
				CourseStatus[rm.get('course').get('name')]='New';
			   }
			   */
			   
		   
			  /*
			   // CourseTask[course.id]=course.get('name');
			   console.log('Course Progress');
			   console.log(rm.get('completed'));
			   console.log(rm.get('completed').length);
			   console.log('lesson lists');
			   var lessoncount=rm.get('course').get('lessons')
			   console.log(lessoncount.length);
			   */
			  res.data.completedCourses=completecourse;
			});
		
			 console.log(CourseStatus);
			  
			/*
			console.log(result);
			console.log(result.get('course'));
			console.log(result.get('completed'));
			console.log(result.get('lesson').get('description'));
            */   
			return next();


			
		});




	}
    static mwgetRecommendedCourses(req,res,next){

		console.log('recommended courses section come here !');
		console.log(req.user._json.user_id);
		const query = new Parse.Query(Parse.Object.extend('Enrollment'));
		query.equalTo('userId', req.user._json.user_id);
		query.include('course');
		query.include('course.instructor');
		query.find().then(enroll=>{
			res.data.enroll = enroll;
			//  console.log(enrollment);
			//  console.log(enrollment.get({"__type": "Pointer", "className": "Course", "objectId":courseid}));
			//console.log(enroll);
			enroll.forEach(myenroll => {
				//console.log(myenroll.get('course'));
				//console.log(myenroll.get('course').get('genre'));
				var mygenre=myenroll.get('course').get('genre');
				if(mygenre!=undefined){
					genre.push(myenroll.get('course').get('genre'));
				}
			});


			/***  query to fetch the course on the bases of genre  */
             console.log(genre);
			 const GenreQuery= new Parse.Query(Parse.Object.extend('Course'));
			 GenreQuery.include('instructor');
			 //GenreQuery.include('instructor.name');
			 GenreQuery.containedIn('genre',genre);
			 GenreQuery.find().then(recommendedcourse =>{
					  console.log(recommendedcourse);
					res.data.recommendedcourse=recommendedcourse;
					return next();
			 },error =>{
				res.data.recommendedcourse=[];				
				res.data.error = error;
				return next();
			 });
			  
		});
	
		 ///console.log('list of course id is given below');
		// console.log(res.data.courseid);

		   
		   //return next();
		   

		



	}

	static mwGetMessage = (req, res, next)=> {
		const msgQuery = new Parse.Query(MessageModel);
		msgQuery.equalTo('studentId', req.user.id);
		msgQuery.include('instructor');
		msgQuery.find().then(allmessage => {
			res.data.allmessage = allmessage;
			return next();
		}, error => {
			res.data.allmessage = [];
			return next();
		});
	}

	static mwgetStudentRegisteredCourses = (req,res,next) =>{
		console.log(res.data.user.user_id);

		const RegisteredQuery =  new Parse.Query(EnrollmentModel);
		RegisteredQuery.equalTo('userId',res.data.user.user_id);
		//RegisteredQuery.withCount();
		RegisteredQuery.find().then(result=>{			 
			 res.data.registeredCourse=result.length;
			 return next();
		});
		 
	}

	static mwGetStudentInfo = (req,res,next)=>{
				 console.log('Student Info Details');
				 const query = new Parse.Query(StudentModel);
				 query.equalTo('objectId', req.user._json.parse_api_key);
				 //query.equalTo('objectId','Hw2ADqFSp8');
				 query.first().then(studentinfo =>{			 
	 			  res.data.firstname= studentinfo.get('firstName');
				  res.data.lastname = studentinfo.get('lastName');	  
		            return next();
				 });
	}

	static  mwGetCourseId= (req,res,next)=>{		
				// fetching the courseid using the voucher code 
				 const voucherquery = new Parse.Query(VoucherModel);		 
				voucherquery.equalTo('VoucherCode',req.body.promocode);
				voucherquery.first().then(course=>{			
		            res.data.courseid=course.get('courseId');			 	       	
					return next();
				});		
			
	}

	static  mwGetCourseName= (req,res,next)=>{			
				const query = new Parse.Query(Parse.Object.extend('Course'));
						query.equalTo('objectId',res.data.courseid);
						query.first().then(coursedetail => {				
						res.data.coursename=coursedetail.get('name');							
		                return next();			
					});

				
			}

			 
	static mwgetVoucherStatus = (req,res,next)=>{

		// checking promocode exists or not 
		const voucherverify=new Parse.Query(VoucherModel);
		voucherverify.equalTo('VoucherCode',req.body.promocode);
		voucherverify.first().then(result=>{
			console.log('Result'+result);
			//console.log(result.length);
			//var record=result.length;
			//console.log(record);
            if(result == undefined){				
				console.log('invalid vouchers');
				res.data.invalid='invalid';
				res.send({'invalid':res.data.invalid});					
			}else {
				const vouchercode = new Parse.Query(VoucherModel);
				vouchercode.equalTo('VoucherCode',req.body.promocode);
				vouchercode.equalTo('Status','Redeem');	
				vouchercode.first().then(v =>{			
				//console.log(v);
					res.data.voucherstatus=v.get('Status');
					return next();
				});	
				res.data.voucherstatus='Available';
				res.data.invalid='valid';
				return next();
			}					
		});		
	}		
	

	static mwUpdateVoucherDetails = (req,res,next)=>{	
        const current_date= moment().format('YYYY/MM/DD');	
		
		const query = new Parse.Query(VoucherModel);		
		query.equalTo('VoucherCode',req.body.promo);		
		query.first().then(result=>{		
			  var exdate = result.get('Expirydate');
			  var matchdate = moment(exdate).format('YYYY/MM/DD'); 

			   if(current_date > matchdate){
				   console.log('coupon expired');
				   res.data.result='Sorry! Coupon is Expired!';
				   return next();
			   }
			   else{					
					const username=res.data.user.user_metadata.firstName+ '  ' +res.data.user.user_metadata.lastName;
					const Vquery = new Parse.Query(VoucherModel);		
					Vquery.equalTo('VoucherCode',req.body.promo);				
					Vquery.first().then(voucher=>{
						
						/*** checking for duplicate record in the Enrollment database */
						const enrollquery = new Parse.Query(EnrollmentModel);
						enrollquery.equalTo("userId",res.data.user.user_id);
						enrollquery.equalTo("course",{"__type": "Pointer", "className": "Course", "objectId": req.body.CourseId});
						enrollquery.find().then(existrecord=>{
								var records = existrecord.length;
								if(records == 1){
									res.data.result='This Course is Already Exits in your Courses !';
                                    return next();
								}
								else{
									voucher.set('Redeem_by',username);
									voucher.set('Status','Redeem');
									voucher.set('EmailId',res.data.user.email);
										voucher.save().then(saved =>{			   
											res.data.result='Data updated Successfully';
											return next();
										});	

									/** query to add the course into enrollment **/
									const enroll = {
										course: {"__type": "Pointer", "className": "Course", "objectId": req.body.CourseId},
										userId: res.data.user.user_id,
										completed: [],
									}	

									const enrollment = new EnrollmentModel();
					                enrollment.save(enroll);
				                	res.data.result='Course is Added Successfully!';
                                    return next();
								}
						});                       
					});
			   }
		});

		

		//console.log('outside loop!');

		/*


	    const username=res.data.user.user_metadata.firstName+ '  ' +res.data.user.user_metadata.lastName;
		const query = new Parse.Query(VoucherModel);		
		query.equalTo('VoucherCode',req.body.promo);				
		query.first().then(voucher=>{
		   voucher.set('Redeem_by',username);
		   voucher.set('Status','Redeem');
		   voucher.set('EmailId',res.data.user.email);
		   voucher.save().then(saved =>{
			   //console.log('data updated Successfully!');
			   res.data.result='Data updated Successfully';
			   return next();
		   });
		   //return next();
		});
		///return next();


		/** query to add the course into enrollment 
		const enroll = {
			course: {"__type": "Pointer", "className": "Course", "objectId": req.body.CourseId},
			userId: res.data.user.user_id,
			completed: [],
		  }
		  
		const enrollment = new EnrollmentModel();
		enrollment.save(enroll);
		res.data.result='Course is Added Successfully!';
		*/
	//	return next();		
	}		
	static mwgetUserEmail= (req,res,next) => {
		res.data.useremail=res.data.user.email;
		return next();
  }

  static mwUpdatePassword = (req,res,next) =>{
	  console.log('username='+res.data.user.user_id);
	  console.log('password='+req.body.cpass);
	  const userquery = new Parse.Query(StudentModel);
	  userquery.equalTo('username',res.data.user.user_id);
	  //userquery.equalTo('password',req.body.cpass);
	  userquery.first().then(result=>{
		  console.log(result.get('password'));
		  console.log(result.get('email'));
		  if(res.data.user.email==result.get('email'));
		  {

			  var options = {
				  method: 'PATCH',
				  url: 'https://ywctw.auth0.com/api/v2/users/'+res.data.user.user_id,
				  headers: {'content-type': 'application/json'},
				  body: {password: 'ankursaini', connection: 'Username-Password-Authentication'},
				  json: true
				};
				
				request(options, function (error, response, body) {
				  if (error) throw new Error(error);				  
				  console.log(body);
				});		  
			  
			  return next();
		  }
		  // console.log(result);
		  // console.log(result.length);			
		   return next();
	  }).catch(error=>{
		  console.log('error!');
		  return next();
	  })

  }

}

module.exports = StudentService;