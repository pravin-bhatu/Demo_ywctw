const Parse = require('../../modules/parse.js');

const Partner = Parse.Object.extend('Partner');

var recordlist=[];
class DashboardPartnerService {

  static mwGetInstructorPartnerCodes(req, res, next) {
    console.log('In Service mwGetInstructorPartnerCodes')
	
    if (!req.isAuthenticated()) return res.redirect('/');
    if (!req.user._json.app_metadata || !req.user._json.app_metadata.role === 'instructor') {
      return res.redirect('/');
    }

    const partnerCodesQuery = new Parse.Query(Parse.Object.extend('Partner'));
    partnerCodesQuery.equalTo('instructor', res.data.instructor);
    partnerCodesQuery.find().then(partnerCodes => {
      if (!res.data.instructor) return res.redirect('/');
      console.log('In Service Partner Code')
      console.log(partnerCodes)
      res.data.partnerCodes = partnerCodes;
      return next();
    });

  }

  static mwGetInstructorPartnerCode(req, res, next) {
    // get one partner code for reporting

    const partnerCodeQuery = new Parse.Query(Parse.Object.extend('Partner'));
    partnerCodeQuery.equalTo('code', res.data.code);
    partnerCodeQuery.find().then(partnerCode => {
     if (!res.data.instructor) return res.redirect('/');
      res.data.parnterCode = partnerCode;
      return next();
    });

    return next();
  }




  static mwCheckPartnerCodes(code, callback) {
    console.log('In mwCheckPartnerCodes CODE:: ' + code);
    const checkPartnerCode = new Parse.Query(Parse.Object.extend('Partner'));
    checkPartnerCode.equalTo('code', code);
    checkPartnerCode.find().then(partnerCode => {
      console.log('Partner Code Length: ' + partnerCode.length);
      if (partnerCode.length !== 0) {
        callback(true);
      } else {
        callback(false);
      }
    });
  }


  static mwUpdatePartnerCodeActive(code, action, callback) {

    let status = true;
    if (action === 'deactivate'){
      status = false;
    }

    const partnerCode = new Partner();
    partnerCode.id = code;
    partnerCode.set('active', status)
    partnerCode.save().then(() => {
      callback(true);
    }, error => {
      console.log('Error :: ' + JSON.stringify(error));
      callback(false);
    });

  }
  
  static mwGetInstructorCourses(req, res, next) {
    const courseQuery = new Parse.Query(Parse.Object.extend('Course')); 
     courseQuery.find().then(courses => {
      res.data.courses = courses;     
      console.log('end here');
      return next();  
    });
  }
  static mwGetInstructorCoursesVoucherInfo(req,res,next){
    const vouchercourseQuery= new Parse.Query(Parse.Object.extend('CourseVoucherInfo'));
    vouchercourseQuery.descending("CreateDate");
    vouchercourseQuery.find().then(courseInfo =>{          
         console.log(courseInfo);
      res.data.courseInfo = courseInfo;  
      return next();
    });    
 }

 static mwgetSingleInstructorCourses(req,res,next){
  //const instructorid=res.data.instructor.id;  
  const instructorid='auk3hoEs5d';
  console.log(instructorid);
  const courseQuery = new Parse.Query(Parse.Object.extend('Course')); 
  courseQuery.equalTo('instructor',{"__type": "Pointer", "className": "Instructor", "objectId": instructorid});
  courseQuery.equalTo('stage','prod');  
  courseQuery.find().then(courses => {
      res.data.mycourses=courses;
      return next();  
     });
  }

  static mwgetSingleVoucherInfo(req,res,next){
    var mycode=[];
    console.log('mwgetSingleVoucherInfo');
    console.log(res.data.mycourses);
    console.log(res.data.mycourses[0].id);
    var instructorcourse=res.data.mycourses;
    for(var i=0;i<instructorcourse.length;i++){
          mycode.push(res.data.mycourses[i].id);
    }
    console.log('my array come here');
    console.log(mycode);
    
    /** code to get the result from voucher info table */
    const VQuery = new Parse.Query(Parse.Object.extend('CourseVoucherInfo'));
    VQuery.containedIn('courseId',mycode);
    VQuery.find().then(myrecord=>{
      res.data.coursedata=myrecord;
      res.data.courselength=myrecord.length;
			return next();
    });
  }
 

}

module.exports = DashboardPartnerService;