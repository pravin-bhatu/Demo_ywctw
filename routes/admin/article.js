const express = require('express');
const router = express.Router();
const Parse = require('../../modules/parse.js');

const AdminService = require('../../services/admin/index.js');
const AdminArticleService = require('../../services/admin/articles.js');
const AdminInstructorsService = require('../../services/admin/instructors.js');
const ArticleModel = Parse.Object.extend('Article');

// const markdown = require('marked');
const moment = require('moment');
const toMarkdown = require('to-markdown');
const MarkdownIt = require('markdown-it');
const markdown = new MarkdownIt();

const formidable = require('express-formidable');
const FileReader = require('filereader');

router.use(AdminService.mwGetAdminUser);

router.get('/',
  [
    AdminArticleService.mwGetAllArticles,
  ], (req, res) => {

  res.data.libs.moment = moment;
  res.render('admin/article/index', res.data);


});

router.get('/add',
  [
    AdminInstructorsService.mwGetInstructors,
  ], (req, res) => {

  res.data.formType = 'Add';
  res.data.values = {};
  res.data.libs.moment = moment;
  res.render('admin/article/addArticle', res.data);

});

router.get('/info',
  [
    AdminArticleService.mwGetArticleInfo,
  ], (req, res) => {

    res.render('admin/article/info', res.data);

});

router.post('/add', (req, res) => {

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
    instructor: {'__type': 'Pointer', 'className': 'Instructor', 'objectId': req.body.articleInstructor},
    published: false,
    slug: slugTitle,
  }

  const article = new ArticleModel();
  article.save(articleData).then(
    () => { res.redirect('/admin/article'); },
    (error) => {
      // TODO: show error form with error message
      console.log('Error adding article');
      console.log(error);
      res.redirect('admin/article/add');
    }
  );

});


router.get('/edit',
  [
    AdminInstructorsService.mwGetInstructors,
    AdminArticleService.mwGetArticleInfo,
  ], (req, res) => {
    console.log('In article edit!')
    res.data.formType = 'Edit';
    res.data.articleId = req.query.id;

    const values = {};
    values.instructorId = res.data.article.get('instructor').id;
    values.title = res.data.article.get('title');
    values.content = res.data.article.get('content');

    res.data.values = values;
    res.data.libs.markdown = markdown;
    res.render('admin/article/addArticle', res.data);

});

router.post('/edit', (req, res) => {
  // const formType = 'Edit';
  const articleId = req.body.articleId;
  console.log('Edit Article ID :: ' + articleId)

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
    instructor: {'__type': 'Pointer', 'className': 'Instructor', 'objectId': req.body.articleInstructor},
    published: false,
    slug: slugTitle,
  }


  const article = new ArticleModel();
  article.id = articleId;
  article.save(articleData).then(
    () => { res.redirect('/admin/article/info?id=' + articleId); },
    (error) => {
      // TODO: show error form with error message
      console.log('Error adding article');
      console.log(error);
      res.redirect('admin/article/add');
    }
  );
});

router.post('/setPublished', (req, res) => {

  let isPublished = false;
  if(req.body.published === 'true') {
    isPublished = true;
  }

  const data = {
    published: isPublished,
  }

  const options = {
    articleId: req.body.articleId,
  }

  AdminArticleService.mwSetArticlePublished(data, options, (e) => {
    if (e) {
      res.redirect('/admin/article/info?id=' + req.body.articleId);
    } else {
      res.render('/admin/article/info?id=' + req.body.articleId);
    }
  });

});

router.post('/uploadHeaderImage', formidable(), (req, res) => {
  const articleId = req.fields.articleId;

  const reader = new FileReader();

  const fileImage = req.files.articleHeaderImage;

  reader.addEventListener('load', function() {
    const parseFile = new Parse.File(fileImage.name, {base64: reader.result}, fileImage.type);

    parseFile.save().then(function() {
      const articleHeader = new ArticleModel();
      articleHeader.id = articleId;
      articleHeader.set('headerImage', parseFile);
      articleHeader.save().then(
        () => { res.redirect('/admin/article/info?id=' + articleId); },
        (error) => {
          // TODO: show error form with error message
          console.log(error);
          res.redirect('/admin/article/info?id=' + articleId);
        }
      );
    }, function(error) {
      // The file either could not be read, or could not be saved to Parse.
      console.log('parseFile save error');
      console.log(error);
      res.redirect('/admin/article/info?id=' + articleId);
    });
  }, false);

  reader.readAsDataURL(fileImage);
});

router.post('/uploadThumbImage', formidable(), (req, res) => {
  const articleId = req.fields.articleId;

  const reader = new FileReader();

  const fileImage = req.files.articleThumbImage;

  reader.addEventListener('load', function() {
    const parseFile = new Parse.File(fileImage.name, {base64: reader.result}, fileImage.type);

    parseFile.save().then(function() {
      const articleHeader = new ArticleModel();
      articleHeader.id = articleId;
      articleHeader.set('thumbImage', parseFile);
      articleHeader.save().then(
        () => { res.redirect('/admin/article/info?id=' + articleId); },
        (error) => {
          // TODO: show error form with error message
          console.log(error);
          res.redirect('/admin/article/info?id=' + articleId);
        }
      );
    }, function(error) {
      // The file either could not be read, or could not be saved to Parse.
      console.log('parseFile save error');
      console.log(error);
      res.redirect('/admin/article/info?id=' + articleId);
    });
  }, false);

  reader.readAsDataURL(fileImage);
});

module.exports = router;
