const Parse = require('../../modules/parse.js');

const DashboardArticleService = {};

DashboardArticleService.mwGetAllArticles = (req, res, next) => {
  const query = new Parse.Query(Parse.Object.extend('Article'));
  //query.equalTo('article', res.data.article);
  query.include('instructor');
  query.find().then(articles => {
    res.data.articles = articles;
    return next();
  });

};

module.exports = DashboardArticleService;