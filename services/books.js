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


  static mwGetAllBooks(req, res, next) {
    const temp = req.body.Genre;
    const query = new Parse.Query(Parse.Object.extend('Book'));
    if (temp) {
      query.equalTo('genre', req.body.Genre);
      res.data.selectedGenre = req.body.Genre;
    }
    else {
      query.equalTo('genre', 'Business');
      res.data.selectedGenre = 'Business';
    }
    query.find().then(books => {
      const columns = new Array();
      let columnCount = 0;
      let count = 0;
      columns[count] = new Array();
      for (let i = 0; i < books.length; i++) {
        columns[count][columnCount] = books[i];
        columnCount++;
        if (columnCount === 4) {
          columnCount = 0;
          count++;
          columns[count] = new Array();
        }
      }
      res.data.books = columns;
      return next();
    }, () => {
      res.data.books = [];
      return next();
    });
  }


  static mwGetPersonalDevelopmentBooks(req, res, next) {
    const query = new Parse.Query(Parse.Object.extend('Book'));
      query.equalTo('genre', 'Personal Development'); 
   
    query.find().then(books => {
      const columns = new Array();
      let columnCount = 0;
      let count = 0;
      columns[count] = new Array();
      for (let i = 0; i < books.length; i++) {
        columns[count][columnCount] = books[i];
        columnCount++;
        if (columnCount === 4) {
          columnCount = 0;
          count++;
          columns[count] = new Array();
        }
      }
      res.data.personalDevelopmentBooks = columns;
      return next();
    }, () => {
      res.data.books = [];
      return next();
    });
    
  }
}

module.exports = BooksService;
