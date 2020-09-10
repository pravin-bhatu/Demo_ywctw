const express = require('express');
const router = express.Router();

const currentUser = require('../middleware/current_user.js');

const AuthService = require('../services/auth.js');
const AffiliateService = require('../services/affiliate.js');
const DiscountService = require('../services/discounts.js');

const authenticate = AuthService.Passport.authenticate('auth0', {failureRedirect: '/'});

const AmbassadorService = require('../services/ambassador');


// Auth0 callback handler
router.get('/callback', [authenticate, currentUser, AffiliateService.mwProcessReferral, DiscountService.mwAffiliateDiscount],
  (req, res) => {  
      if (!req.user) throw new Error('user null');
      const page = req.cookies.pathName || '/';
      console.log('PATH NAME: ' + page);
      if (req.isAuthenticated()) {
        if (res.data.currentUser.get('affiliate')){
          return res.redirect('/affiliates/program')
        }
        else if (res.data.currentUser.get('instructor')){
          return res.redirect('/dashboard')
        }
        else if (res.data.currentUser.get('admin')){
          return res.redirect('/admin')
        }
        else {
          return res.redirect('/student')
        }
      }
      // if(page == '/affiliates'){
      //   AmbassadorService.mwAmbassadorHandler(req.user._json.parse_api_key, function(){
      //     return res.redirect('/affiliates/program');
      //   });
      // } else {
      //   res.redirect(page);
      // }
  }
);

router.get('/login', AuthService.Passport.authenticate('auth0', {
  clientID: 'gXvJyMF5l16co6Gwyw3DrbAlg6GHWczY',
  domain:  'https://auth.youwillchangetheworld.com/authorize' ,
  redirectUri: '/callback',
  responseType: 'code',
  scope: 'openid profile email'}),
  function(req, res) {
    res.redirect("/");
});

router.get('/logout', (req, res) => {
  var https = require('https');
  if(req.isAuthenticated){
    https.get('https://ywctw.auth0.com/v2/logout?returnTo=https%3A%2F%2Fyouwillchangetheworld.com', function() {
      req.logout();
      req.session.destroy();
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }

});

module.exports = router;
