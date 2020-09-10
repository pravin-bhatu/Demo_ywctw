const Parse = require('../modules/parse.js');

const ArticleService = {};
const ArticleModel = Parse.Object.extend('Article');

// Middleare to get articles base on instructor.
ArticleService.mwGetForInstructor = (req, res, next) => {
  const query = new Parse.Query(ArticleModel);
  query.equalTo('instructor', res.data.instructor);
  query.equalTo('published', true);
  query.find().then(
    articles => {
      res.data.articles = articles;
      next();
    },
    error => {
      res.data.articles = [];
      next();
    }
  );
};

ArticleService.mwGetArticles = (req, res, next) => {
  const query = new Parse.Query(ArticleModel);
  query.include('instructor');
  query.equalTo('published', true);
  query.descending('createdAt');
  query.find().then( articles => {
    res.data.articles = articles;
    return next();
  },
  error => {
    res.data.articles = [];
    return next();
  });

};


ArticleService.mwGetArticle = (req, res, next) => {
  const query = new Parse.Query(ArticleModel);
  query.equalTo('slug', req.params.slug);
  query.include('instructor');
  query.first().then( article => {
    res.data.article = article;
    res.data.instructor = article.get('instructor');
    next();
  },
  error => {
    // TODO: Log this error
    res.redirect('/articles');
  }).catch(() => {
    // no results
    res.redirect('/articles');
  });
};




module.exports = ArticleService;
