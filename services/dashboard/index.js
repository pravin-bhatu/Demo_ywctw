const Parse = require('../../modules/parse.js');


class DashboardService {

  static mwGetInstructor(req, res, next) {
	
    if (!req.isAuthenticated()) return res.redirect('/');
    if (!req.user._json.app_metadata || !req.user._json.app_metadata.role === 'instructor') {
      return res.redirect('/');
    }

    const instructorQuery = new Parse.Query(Parse.Object.extend('Instructor'));
    instructorQuery.equalTo('authId', req.user._json.user_id);
    instructorQuery.first().then(instructor => {
      if (!instructor) return res.redirect('/');
      res.data.instructor = instructor;
      return next();
    });
  }
  
  static  mwgetIndividualInstructor(req,res,next){
    const instructorid=res.data.instructor.id; 
    const userQuery = new Parse.Query(Parse.Object.extend('User'));
    userQuery.equalTo('instructor',{"__type": "Pointer", "className": "Instructor", "objectId": instructorid});
    userQuery.include('instructor');
    userQuery.include('Course');
    userQuery.first().then(record =>{
            res.data.admin=record.get('admin');
            res.data.instructorName=record.get('instructor').get('name');         
            return next();
    });   

  }



  static mwGetVideo(req, res, next) {
    if (!req.isAuthenticated()) return res.redirect('/');
    if (!req.user._json.app_metadata || !req.user._json.app_metadata.role === 'instructor') {
      return res.redirect('/');
    }
    const query = new Parse.Query(Parse.Object.extend('Library'));
    query.equalTo('user_id', req.user._json.user_id);
    query.equalTo('FileType', 'IntroVideo');
    query.first().then(files => {
      res.data.files = files; 
      return next();
    }, error => {
      res.data.files = [];
      res.data.error = error;
      return next();
    });
  }

  static mwGetAllInstructor(req, res, next) {
    const instructorQuery = new Parse.Query(Parse.Object.extend('Instructor'));
    instructorQuery.equalTo('published', true);
    // instructorQuery.notEqualTo('avatar', undefined);
    instructorQuery.ascending('order');
    instructorQuery.find().then(instructors => {
      res.data.instructors = instructors;
      return next();
    }, error => {
      res.data.instructors = [];
      res.data.error = error;
      return next();
    });
  }


}

module.exports = DashboardService;
