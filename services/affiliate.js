const Parse = require('../modules/parse.js');
const analytics = require('../modules/analytics.js');
const superagent = require('superagent');

class AffiliateService {
  static read(id = '') {
    return new Promise((resolve, reject) => {
      const Affiliate = Parse.Object.extend('Affiliate');
      const query = new Parse.Query(Affiliate);
      query.get(id).then(
        affiliate => { return resolve(affiliate); },
        error => { return reject(error); }
      );
    });
  }

  static mwProcessReferral(req, res, next) {
    if (!req.isAuthenticated()) return next();
    if (!res.data.currentUser) return next();
    if (res.data.currentUser.get('referredBy') || res.data.currentUser.get('referredBy') === null) return next();
    const affiliateCode = req.cookies.referral || null;
    const campaignCode = req.cookies.campaign || null;
    function saveUser(affiliate) {
      superagent.put('https://ywctw-parse.herokuapp.com/users/' + res.data.currentUser.id)
        .send({
          referredBy: (affiliate ? {
            __type: 'Pointer',
            className: 'Affiliate',
            objectId: affiliate.id,
          } : null),
          campaign: (campaignCode ? {
            __type: 'Pointer',
            className: 'MarketCampaign',
            objectId: campaignCode,
          } : null),
        })
        .set('Content-Type', 'application/json')
        .set('X-Parse-Application-Id', 'T6HAEsetwja2ojRQIVCyqaxv0S8wZ3Z8Ew7OT4M2')
        .set('X-Parse-REST-API-Key', 'qhRxV0pyTZX6POpBXQIPxBB0kUfXWJKvomS78tQY')
        .set('X-Parse-Session-Token', req.user._json.app_metadata.parse_session_token)
        .end((error, response) => {
          // TODO: Do something with this error.
          res.data.currentUser.set('referredBy', affiliate ? affiliate.id : null);
          analytics.track({
            userId: res.data.currentUser.id,
            event: 'Signed Up From Affiliate',
            properties: {
              authId: req.user._json.user_id,
              affiliateId: affiliate ? affiliate.id : null,
              affiliateLink: req.cookies.referralLink || null,
            },
          });
          return next();
        });
    }

    if (affiliateCode) {
      AffiliateService.read(affiliateCode).then(affiliate => {
        saveUser((affiliate ? affiliate : null));
      }).catch(error => {
        // TODO: Do something with this error.
        saveUser(null);
      });
    } else {
      saveUser(null);
    }
  }
}

module.exports = AffiliateService;
