const Parse = require('../modules/parse.js');

class BooksService {
  static mwGetForInstructor(req, res, next) {
    if (!res.data.instructor) {
      res.data.books = [];
      return next();
    }
    const query = new Parse.Query(Parse.Object.extend('Book'));
    query.equalTo('instructor', res.data.instructor);
    query.equalTo('onCourse', true);
    query.find().then(books => {
      res.data.books = books;
      return next();
    }, () => {
      res.data.books = [];
      return next();
    });
  }
}

module.exports = BooksService;
