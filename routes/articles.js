const express = require('express');
const router = express.Router();

const MarkdownIt = require('markdown-it');
const markdown = new MarkdownIt();
const moment = require('moment');
const _ = require('underscore');

const ArticleService = require('../services/article.js');
const BooksService = require('../services/books.js');
const CourseService = require('../services/course.js');

const Course = require('../service/course');

router.get('/articles',
  [
    BooksService.mwGetForInstructor,
    ArticleService.mwGetArticles,
  ],
  (req, res) => {

    res.data.libs.markdown = markdown;
    res.data.libs.moment = moment;
    res.render('articles/index', res.data);

});

router.get('/rssfeed',
  [
    ArticleService.mwGetArticles,
  ], (req, res) => {

    res.data.libs.markdown = markdown;
    res.data.libs.moment = moment;
    res.render('articles/rssfeed', res.data);
});

router.get('/:slug',
  [
    ArticleService.mwGetArticle,
    ArticleService.mwGetForInstructor,
    CourseService.mwGetForInstructor,
    BooksService.mwGetForInstructor,
  ],
  (req, res) => {

    if (res.data.books.length != 0) {
      if (res.data.books.length > 1) {
        res.data.book = _.sample(res.data.books);
      } else {
        res.data.book = res.data.books[0];
      }
    }

    if (res.data.courses.length != 0) {
      if (res.data.courses.length > 1) {
        res.data.course = _.sample(res.data.courses);
      } else {
        res.data.course = res.data.courses[0];
      }
    }

    res.data.shareTEXT = res.data.article.get('instructor').get('name') + ' | ' + res.data.article.get('title');
    res.data.affiliateID = "SET-AFFILIATE-ID-IN-ROUTE"; 
    res.data.shareURL = req.protocol + '://' + req.get('host') + req.originalUrl + "?ref=" + res.data.affiliateID;      

    res.data.libs.markdown = markdown;
    res.data.libs.moment = moment;
    res.data.meta.title = res.data.article.get('instructor').get('name') + ' | ' + res.data.article.get('title');
    res.data.meta.og.title = res.data.article.get('instructor').get('name') + ' | ' + res.data.article.get('title');
    res.data.meta.og.description = res.data.article.get('content').substring(0, 300) + '...';
    res.data.meta.og.image = res.data.article.get('headerImage') ? res.data.article.get('headerImage').url() : res.data.meta.og.image;
    res.render('articles/feature', res.data);

});

module.exports = router;