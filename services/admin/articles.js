const Parse = require('../../modules/parse.js');

const AdminArticleService = {};
const ArticleModel = Parse.Object.extend('Article');

AdminArticleService.mwGetAllArticles = (req, res, next) => {
  const query = new Parse.Query(ArticleModel);
  query.include('instructor');

  if (req.query.filter) {
    if(req.query.filter === 'published') {
      query.equalTo('published', true);
    } else {
      query.equalTo('published', false);
    }

  }

  query.descending('createdAt');
  query.find().then( articles => {
      res.data.articles = articles;
      next();
    },
    error => {
      res.data.articles = [];
      next();
    });

};

AdminArticleService.mwGetArticleInfo = (req, res, next) => {
  const query = new Parse.Query(ArticleModel);
  query.include('instructor');
  query.equalTo('objectId', req.query.id);
  query.first().then( article => {
      res.data.article = article;
      next();
    },
    error => {
      console.log('Error');
      res.data.article = [];
      next();
    });

};


AdminArticleService.mwSetArticlePublished = (data, options, callback) => {

  const updatePublished = new ArticleModel();
  updatePublished.id = options.articleId;
  updatePublished.save(data).then(() => {
    callback(true);
  }, error => {
    console.log('Error :: ' + JSON.stringify(error));
    callback(false);
  });

};

module.exports = AdminArticleService;