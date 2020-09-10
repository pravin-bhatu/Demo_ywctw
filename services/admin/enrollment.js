const Parse = require('../../modules/parse.js');
const _ = require('underscore');

const EnrollmentModel = Parse.Object.extend('Enrollment');

class AdminEnrollmentService {

  static mwAddEnrollments(data, callback) {
    let count = 1;

    // console.log('data.courses.length :: ' + data.courses.length);

    _.each(data.courses, course => {
      // console.log('course in loop :: ' + course);
      const enroll = {
        course: {"__type": "Pointer", "className": "Course", "objectId": course},
        userId: data.authId,
        completed: [],
      }

      const enrollment = new EnrollmentModel();


      enrollment.save(enroll).then((result) => {
        if(count === data.courses.length) {
           console.log('At the end');
           callback(true);
         }
         count++;
      }, error => {
         console.log('Error :: ' + JSON.stringify(error));
         callback(false);
      });
    });
  }

}

module.exports = AdminEnrollmentService;