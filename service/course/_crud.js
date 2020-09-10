const Parse = require('../../modules/parse');

exports.read = (options = {}, callback) => {
  const Course = Parse.Object.extend('Course');
  const query = new Parse.Query(Course);

  if (options.stage) query.equalTo('stage', options.stage);
  if (options.published) query.equalTo('published', options.published);
  if (options.slug) query.equalTo('slug', options.slug);
  if (options.instructor) query.equalTo('instructor', options.instructor);
  if (options.limit) query.limit(options.limit);

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
    query.descending('createdAt');
    query.find().then(success, failure);
  }
};
