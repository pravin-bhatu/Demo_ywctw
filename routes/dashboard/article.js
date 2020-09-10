const express = require('express');
const router = express.Router();
const Parse = require('../../modules/parse.js');

const DashboardService = require('../../services/dashboard/index.js');
const DashboardArticleService = require('../../services/dashboard/article.js');
const ArticleModel = Parse.Object.extend('Article');

const toMarkdown = require('to-markdown');
const moment = require('moment');

router.get('/',
  [
    DashboardService.mwGetInstructor,
    DashboardArticleService.mwGetAllArticles,
  ], (req, res) => {

    res.data.instructorId = res.data.instructor.id;
    res.data.libs.moment = moment;
    res.render('dashboard/article/index', res.data);
    // res.render('dashboard/soon', res.data);
  });

router.get('/add',
  [
    DashboardService.mwGetInstructor,
    DashboardArticleService.mwGetAllArticles,
  ], (req, res) => {

    res.data.libs.moment = moment;
    res.render('dashboard/article/index', res.data);
  });

router.get('/thank-you', (req, res) => {
    res.render('dashboard/article/thank-you', res.data);
});

router.get('/preview', (req, res) => {
  res.render('dashboard/article/feature-preview', res.data);

  });


router.post('/add', (req, res) => {

  console.log('In article add')

  const name = req.body.articleTitle;
  const slugTitle = name.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');

  const markdownContent = toMarkdown(req.body.articleContent)

  const articleData = {
    title: req.body.articleTitle,
    content: markdownContent,
    instructor: {'__type': 'Pointer', 'className': 'Instructor', 'objectId': req.body.instructorId},
    published: false,
    slug: slugTitle,
  }

  console.log('ArticleData ::');
  console.log(articleData);


  const article = new ArticleModel();
  article.save(articleData).then(
    () => { res.redirect('/dashboard/article/thank-you'); },
    (error) => {
      // TODO: show error form with error message
      console.log('Error adding article');
      console.log(error);
      res.redirect('dashboard/article');
    }
  );
});

module.exports = router;