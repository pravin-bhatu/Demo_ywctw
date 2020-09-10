var express = require('express');
var router = express.Router();

const BooksService = require('../services/books.js');
 
router.get('/',[BooksService.mwGetAllBooks,BooksService.mwGetPersonalDevelopmentBooks], (req, res) => {
  res.data.currentUrl='/books';
  console.log(res.data);
  res.render('books/index',res.data);
});

router.post('/',[BooksService.mwGetAllBooks], (req, res) => {
  res.data.currentUrl='/books';
  console.log(res.data);
  res.render('books/index',res.data);
});

module.exports = router;