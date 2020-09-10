const Parse = require('../../modules/parse');

exports.read = (options = {}, callback) => {
  const Instructor = Parse.Object.extend('Instructor');
  const query = new Parse.Query(Instructor);

  if (options.username) query.equalTo('username', options.username);

  if (options.include) {
    for (let i = 0; i < options.include.length; i++) {
      query.include(options.include[i]);
    }
  }

  if (options.select) {
    for (let i = 0; i < options.select.length; i++) {
      query.select(options.select[i]);
    }
  }

  const success = (data) => { callback(null, data); };
  const failure = (error) => { callback(error); };

  if (options.id) {
    query.get(options.id).then(success, failure);
  } else if (options.single) {
    query.first().then(success, failure);
  } else {
    query.find().then(success, failure);
  }
};
