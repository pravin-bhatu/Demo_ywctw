// Module for handling affiliate stuffs.

var queryString = require('query-string');
var cookies = require('js-cookie');

// Set the referral cookie if there isn't already one, also send event to keen.
exports.setReferral = function () {
  if (cookies.get('referral')) return;

  var query = queryString.parse(location.search);
  if (!window.meta.currentUserId.length && query.ref) {
    cookies.set('referral', query.ref);
    cookies.set('referralLink', document.referrer);
    window.analytics.track('Visit From Affiliate', {
      affiliateId: query.ref,
      referralLink: document.referrer,
    });
  }

  if (query.campaign) {
    cookies.set('campaign', query.campaign);
    window.analytics.track('Visit From Campaign', {
      campaign: query.campaign,
      referrer: document.referrer,
    });
  }
};
