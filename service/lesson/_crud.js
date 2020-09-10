const Parse = require('../../modules/parse');

exports.read = (options = {}, callback) => {
  const Lesson = Parse.Object.extend('Lesson');
  const query = new Parse.Query(Lesson);

  if (options.slug) query.equalTo('slug', options.slug);
  if (options.course) query.equalTo('course', options.course);

  if (options.select) {
    for (let i = 0; i < options.select.length; i++) {
      query.select(options.select[i]);
    }
  }

  if (options.include) {
    for (let i = 0; i < options.include.length; i++) {
      query.include(options.include[i]);
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
