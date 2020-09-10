const Parse = require('../../modules/parse.js');

const Instructor = Parse.Object.extend('Instructor');
const Book = Parse.Object.extend('Book');
const Affiliate = Parse.Object.extend('Affiliate');

const _ = require('underscore');

class AdminInstructorService {

  static mwGetInstructors(req, res, next) {

    const instructorsQuery = new Parse.Query(Parse.Object.extend('Instructor'));
    instructorsQuery.ascending('name');
    instructorsQuery.find().then(instructors => {
      res.data.instructors = instructors;
      return next();
    });

    // TODO: Group by published and not published
  }

  static mwGetInstructorInfo(req, res, next) {
    const query = new Parse.Query(Parse.Object.extend('Instructor'));
    query.equalTo('objectId', req.query.id);
    query.first().then(instructor => {
      res.data.instructor = instructor;
      return next();
    });
  }

  static mwGetInstructorEmail(req, res, next) {
    const query = new Parse.Query(Parse.Object.extend('User'));
    query.equalTo('username', res.data.instructor.get('authId'));
    query.first().then(user => {
      res.data.instructorUser = user;
      return next();
    });
  }

  static mwInsertInstructorInfo(data, options, callback) {
    console.log('FormType :: ' + options.type);

    const instructor = new Instructor();
    if (options.type === 'Edit') {
      instructor.id = options.instructorId;
    }
    instructor.save(data).then(() => {
      callback(true);
    }, error => {
      console.log('Error :: ' + JSON.stringify(error));
      callback(false);
    });
  }

  static mwSetInstructorActive(data, callback) {
    const instructor = new Instructor();
    instructor.id = data.id;
    instructor.set('published', data.status)
    instructor.save().then(() => {
      callback(true);
    }, error => {
      console.log('Error :: ' + JSON.stringify(error));
      callback(false);
    });
  }

  static mwAddUpdateBook(data, callback) {
    const book = new Book();
    book.save(data).then(() => {
      callback(true);
    }, error => {
      console.log('Error :: ' + JSON.stringify(error));
      callback(false);
    });
  }

  static mwGetInstructorStudentBody(req, res, next) {
    const query = new Parse.Query(Parse.Object.extend('User'));
    query.equalTo('referredBy', {'__type': 'Pointer', 'className': 'Affiliate', 'objectId': req.body.affiliateId});
    query.limit(1000);
    query.find().then(students => {
      const studentList = [];
      _.each(students, student => {
        if(student.get('email')) {
          studentList.push({'email': student.get('email'), 'firstName': student.get('firstName'), 'lastName': student.get('lastName')});
        }
      });
      res.data.studentList = studentList;
      return next();
    });
  }

  static mwSetAffiliateCode(instructorId, callback) {
    const affiliate = new Affiliate();

    const affiliateInfo = {
      instructor: {"__type":"Pointer","className":"Instructor","objectId": instructorId},
    }

    affiliate.save(affiliateInfo).then((result) => {
      const instructor = new Instructor();
      instructor.id = instructorId;
      instructor.set('affiliate', {'__type': 'Pointer', 'className': 'Affiliate', 'objectId': result.id});
      instructor.save().then(() => {
        callback(true);
      }, error => {
        console.log('Error :: ' + JSON.stringify(error));
        callback(false);
      });
    }, error => {
      console.log('Error :: ' + JSON.stringify(error));
      callback(false);
    });
  }


  static mwSetUserAuth(data, callback) {
    const instructor = new Instructor();
    instructor.id = data.instructorId;
    instructor.set('authId', data.authId);
    instructor.save().then(() => {
      const userQuery = new Parse.Query(Parse.Object.extend('User'));
      userQuery.equalTo('username', data.authId);
      userQuery.first().then((result) => {
        const userInfo = {
          instructor: {'__type': 'Pointer', 'className': 'Instructor', 'objectId': data.instructorId},
          affiliate: {'__type': 'Pointer', 'className': 'Affiliate', 'objectId': data.affiliateId},
        }

        result.save(userInfo, {useMasterKey: true}).then(() => {
          callback(true);
        }, error => {
          console.log('Error :: ' + error.code + ' ' + error.message);
          callback(false);
        });
      }, error => {
        console.log('Error: ' + error.code + ' ' + error.message);
        callback(false);
      });
    }, error => {
      console.log('Error :: ' + JSON.stringify(error));
      callback(false);
    });
  }


}

module.exports = AdminInstructorService;
