const Parse = require('../modules/parse.js');
const PartnerModel = Parse.Object.extend('Partner');


class PartnerService {
  static mwGetPartnerCode(req, res, next) {
    res.data.hideCodePassed = true;
    res.data.hideCodeError = true;
    if (!req.query.pc && !req.body.code) return next();

    let code;
    if (req.query.pc) {
      code = req.query.pc.toUpperCase();
    } else {
      code = req.body.code.toUpperCase();
    }

    const query = new Parse.Query(PartnerModel);
    query.equalTo('code', code);
    query.equalTo('active', true);
    query.find().then(code => {
      if(code.length === 1) {
        res.data.partnerCode = code[0];
      } else {
        res.data.hideCodeError = false;
      }
      return next();
    }, () => {
      return next();
    });
  }

}

module.exports = PartnerService;
