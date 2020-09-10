const Parse = require('../../modules/parse');
const Enrollment = Parse.Object.extend('Enrollment');

exports.create = (options, callback) => {
  const success = (data) => { callback(null, data); };
  const failure = (error) => { callback(error); };

  options.completed = [];

  const enrollment = new Enrollment();
  enrollment.save(options).then(success, failure);
};

exports.read = (options = {}, callback) => {
  const success = (data) => { callback(null, data); };
  const failure = (error) => { callback(error); };

  const query = new Parse.Query(Enrollment);

  if (options.userId) query.equalTo('userId', options.userId);
  if (options.course) query.equalTo('course', options.course);

  if (options.id) {
    query.get(options.id).then(success, failure);
  } else if (options.single) {
    query.first().then(success, failure);
  } else {
    query.find().then(success, failure);
  }
};

exports.update = (id, options, callback) => {
  const success = (data) => { callback(null, data); };
  const failure = (error) => { callback(error); };

  if (!id) return failure('Id is required to update, did you mean create?');

  const enrollment = new Enrollment();
  enrollment.id = id;
  enrollment.save(options).then(success, failure);
};
