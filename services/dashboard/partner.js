const Parse = require('../../modules/parse.js');

const Partner = Parse.Object.extend('Partner');

class DashboardPartnerService {

  static mwGetInstructorPartnerCodes(req, res, next) {
    console.log('In Service mwGetInstructorPartnerCodes')
    if (!req.isAuthenticated()) return res.redirect('/');
    if (!req.user._json.app_metadata || !req.user._json.app_metadata.role === 'instructor') {
      return res.redirect('/');
    }

    const partnerCodesQuery = new Parse.Query(Parse.Object.extend('Partner'));
    partnerCodesQuery.equalTo('instructor', res.data.instructor);
    partnerCodesQuery.find().then(partnerCodes => {
      if (!res.data.instructor) return res.redirect('/');
      console.log('In Service Partner Code')
      console.log(partnerCodes)
      res.data.partnerCodes = partnerCodes;
      return next();
    });

  }

  static mwGetInstructorPartnerCode(req, res, next) {
    // get one partner code for reporting

    const partnerCodeQuery = new Parse.Query(Parse.Object.extend('Partner'));
    partnerCodeQuery.equalTo('code', res.data.code);
    partnerCodeQuery.find().then(partnerCode => {
      if (!res.data.instructor) return res.redirect('/');
      res.data.parnterCode = partnerCode;
      return next();
    });

    return next();
  }




  static mwCheckPartnerCodes(code, callback) {
    console.log('In mwCheckPartnerCodes CODE:: ' + code);
    const checkPartnerCode = new Parse.Query(Parse.Object.extend('Partner'));
    checkPartnerCode.equalTo('code', code);
    checkPartnerCode.find().then(partnerCode => {
      console.log('Partner Code Length: ' + partnerCode.length);
      if (partnerCode.length !== 0) {
        callback(true);
      } else {
        callback(false);
      }
    });
  }


  static mwUpdatePartnerCodeActive(code, action, callback) {

    let status = true;
    if (action === 'deactivate'){
      status = false;
    }

    const partnerCode = new Partner();
    partnerCode.id = code;
    partnerCode.set('active', status)
    partnerCode.save().then(() => {
      callback(true);
    }, error => {
      console.log('Error :: ' + JSON.stringify(error));
      callback(false);
    });

  }


}

module.exports = DashboardPartnerService;