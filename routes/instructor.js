const express = require('express');
const router = express.Router();

const Parse = require('../modules/parse.js');
const MarkdownIt = require('markdown-it');
const markdown = new MarkdownIt();
const moment = require('moment');

const Instructor = require('../service/instructor');
const ArticleService = require('../services/article.js');

const CourseService = require('../services/course.js');
const BooksService = require('../services/books.js');

/* GET home page. */
router.get('/', (req, res) => {
  const query = new Parse.Query(Parse.Object.extend('Instructor'));
  query.equalTo('published', true);
  query.ascending('order');
  query.find().then(
    instructors => {
      const columns = [[], [], []];
      let columnCount = 0;
      for (let i = 0; i < instructors.length; i++) {
        columns[columnCount].push(instructors[i]);
        columnCount++;
        if (columnCount === 3) columnCount = 0;
      }
      res.data.libs.moment = moment;
      res.data.libs.markdown = markdown;
      res.data.instructors = columns;
      res.data.currentUrl='/instructors';
      res.render('user/group', res.data);
    },
    error => {
      // TODO: Handle this error.
      res.redirect('/');
    }
  );
});

/* GET become page. */
router.get('/become', (req, res) => {
  res.render('instructors/become', res.data);
  
});

/* GET register page. */
router.get('/register', (req, res) => {
  res.render('instructors/register', res.data);
});

router.get('/:username', [
  Instructor.Middleware.getByUsername,
  BooksService.mwGetForInstructor,
  CourseService.mwGetForInstructor,
  ArticleService.mwGetForInstructor,
], (req, res) => {
  res.data.meta.title = res.data.instructor.get('name');
  res.data.libs.moment = moment;
  res.data.libs.markdown = markdown;
  res.data.currentUrl='/instructors';
  res.render('user/index', res.data);
});

router.post('/register', (req, res) => {

  const registerData = {
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    phone: req.body.phone,
    address1: req.body.address1,
    address2: req.body.address2,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    country: req.body.country,
    courseTitle: req.body.courseTitle,
    courseDescription: req.body.courseDescription,
    courseGenre: req.body.courseGenre,
  };
  
  console.log(registerData);

  res.render('instructors/register', res.data);

});

module.exports = router;
