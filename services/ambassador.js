const Parse = require('../modules/parse.js');

const User = Parse.Object.extend('User');
const Ambassador = Parse.Object.extend('Ambassador');
const Affiliate = Parse.Object.extend('Affiliate');
const Keen = require('keen-js');
const keenClient = require('../modules/keen.js');

class AmbassadorService {

    static mwAmbassadorHandler(userId, callback){
        console.log('signing in or registering from affiliates: create new affiliate ambo');
        AmbassadorService.mwCheckIfIsAmbassador(userId, (ambassador) => {
          console.log('AMBER' + ambassador);
          if(Array.isArray(ambassador)){
            console.log('ambo already exists on signin/up');
            callback(ambassador);
          } else {
            AmbassadorService.mwCreateAmbassador(userId, function() {
              console.log('NEW AMBO created on user signup')
              callback(ambassador);
            });
          }
        });
    }

    static mwCreateAmbassador(userId, callback) {
        const ambassador = new Ambassador();
        const ambassadorInfo = {
            user: {"__type":"Pointer","className":"_User","objectId": userId},
            vanity: userId
        }
        ambassador.save(ambassadorInfo).then((ambassdorResult) => {
            const affiliate = new Affiliate();
            const affiliateInfo = {
                ambassador: {"__type":"Pointer","className":"Ambassador","objectId": ambassdorResult.id},
            }
            affiliate.save(affiliateInfo).then((affiliateResult) => {
                const finAmbassador = new Ambassador();
                console.log('AMBO RESULT: ' + JSON.stringify(ambassdorResult));
                finAmbassador.id = ambassdorResult.id;
                finAmbassador.set('affiliate', {'__type': 'Pointer', 'className': 'Affiliate', 'objectId': affiliateResult.id});
                finAmbassador.save().then((finAmbassadorData) => {
                    const userUpdate = new User();
                    console.log('AFFILIATE Result: ' + JSON.stringify(affiliateResult));
                    console.log('User Update: ' + affiliateResult.id);
                    userUpdate.id = userId;
                    const userAA = {
                        affiliate: {'__type': 'Pointer', 'className': 'Affiliate', 'objectId': affiliateResult.id},
                        ambassador: {"__type":"Pointer","className":"Ambassador","objectId": ambassdorResult.id},
                    };
                    userUpdate.save(userAA, {useMasterKey: true}).then((finUser) => {
                        console.log('Fin User : ' + JSON.stringify(finUser));
                        callback(finAmbassadorData);
                    }), error => {
                        console.log('Error::' +JSON.stringify(error));
                        callback(error);
                    }
                }, error => {
                    console.log('Error :: ' + JSON.stringify(error));
                    callback(error);
                });
            });
        });
    }

    static mwCheckIfIsAmbassador(userId, callback){
        console.log('User ID' + userId);
        const ambassador = new Ambassador();
        const amboQuery = new Parse.Query(ambassador); 
        
        var userPointer = {
            __type: 'Pointer',
            className: '_User',
            objectId: userId
        }
        //amboQuery.include("objectId");   //Add this line
            
        amboQuery.equalTo('user', userPointer);
        console.log('ambo query');
        amboQuery.find().then(
            ambo => {
                console.log('THEN AMBO' + JSON.stringify(ambo));
                const cc = JSON.stringify(ambo);
                const ca = JSON.parse(cc)
                console.log('CA ' + ca.length);
                if(ca.length > 0){
                    return callback(ca);
                } else {
                    return callback('no ambo');
                }  
            }, error => {
                console.log('ambo query err: ' + JSON.stringify(error));
                return callback(JSON.stringify(error));
            }
        )
    }

    static mwGetAmbassadorByVanity = (req, res, next) => {
        const query = new Parse.Query(Ambassador);
        query.equalTo('vanity', req.params.vanity);
        console.log('GET BY VANITY:' + req.params.vanity);
        query.first().then( ambassador => {
          res.data.ambassador = ambassador;
          console.log(ambassador.length);
          next();
        }, error => {
          // TODO: Do something with this error.
          console.log(error);
          res.redirect('/');
        }).catch(() => {
          // no results - go to instructors page
          res.redirect('/');
        });
    };

    static getAmboProgram(req, res, next) {
        if (!res.data.currentUser || !res.data.currentUser.get('affiliate')) {
            return res.redirect('/');
        }
        const affiliateQuery = new Parse.Query(Parse.Object.extend('Affiliate'));
        affiliateQuery.get(res.data.currentUser.get('affiliate').id).then(affiliate => {
            const visitCount = new Keen.Query('count', {
                eventCollection: 'Visit From Affiliate',
                timeframe: 'this_100_years',
                filters: [{
                  'property_name': 'affiliateId',
                  'operator': 'eq',
                  'property_value': affiliate.id,
                }],
              });
              const signupCount = new Keen.Query('count', {
                eventCollection: 'Signed Up From Affiliate',
                timeframe: 'this_100_years',
                filters: [{
                  'property_name': 'affiliateId',
                  'operator': 'eq',
                  'property_value': affiliate.id,
                }],
              });
              const orderCount = new Keen.Query('count', {
                eventCollection: 'User Enrolled in Course',
                timeframe: 'this_100_years',
                filters: [{
                  'property_name': 'affiliateId',
                  'operator': 'eq',
                  'property_value': affiliate.id,
                }, {
                  'property_name': 'coursePrice',
                  'operator': 'gt',
                  'property_value': 0,
                }],
              });
              keenClient.run([visitCount, signupCount, orderCount], (err, response) => {
                res.data.analytics = {};
                res.data.analytics.visits = response[0].result;
                res.data.analytics.registrations = response[1].result;
                res.data.analytics.orders = response[2].result;
                res.data.affiliate = affiliate;
                return next();
                //
              });
        });
    }
    
}


module.exports = AmbassadorService;