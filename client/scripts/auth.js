var queryString = require('query-string');
var cookies = require('js-cookie');


$('.sign-up').click(function(event) {
  //console.log('PATH NAME 11: ' + window.location.pathname);
  cookies.set('pathName', window.location.pathname);
  event.preventDefault();
  window.location.replace("/auth/login");
});