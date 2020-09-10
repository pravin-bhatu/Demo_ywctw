const express = require('express');
const router = express.Router();

const AmbassadorService = require('../services/ambassador');
const CourseService = require('../services/course.js');
const Parse = require('../modules/parse');
const UserService = require('../services/user.js');

const Keen = require('keen-js');
const keenClient = require('../modules/keen.js');
const bodyParser = require('body-parser');

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        AmbassadorService.mwCheckIfIsAmbassador(req.user._json.parse_api_key, (ambassador) => {
            console.log('ambassador ' + JSON.stringify(ambassador));
            if(Array.isArray(ambassador)){
                res.data.ambassadorExists = true;
                res.data.ambassador = ambassador[0];
                console.log(res.data.ambassador);
            }
            res.render('ambassador/registration/application', res.data);
        })
    } else {
        res.render('ambassador/registration/application', res.data);
    }
});


router.get('/program',  (req, res) => {
    console.log('PROGRAM');
    if (!res.data.currentUser || !res.data.currentUser.get('affiliate')) {
        return res.redirect('/');
    }

    const affiliateQuery = new Parse.Query(Parse.Object.extend('Affiliate'));
    affiliateQuery.get(res.data.currentUser.get('affiliate').id).then(affiliate => {
            res.data.affiliate = affiliate;
            console.log('KEEEEEEEN');
            return res.render('ambassador/program/index', res.data);
    });
});

router.get('/program/training', (req, res) => {
    if (!res.data.currentUser || !res.data.currentUser.get('affiliate')) {
        return res.redirect('/');
    }
    const courseQuery = new Parse.Query(Parse.Object.extend('Course'));
    courseQuery.get('ActRzgnjy8').then(course => {
        res.data.course = course;
        return res.render('ambassador/program/training', res.data);
    });
});

router.get('/program/faq', (req, res) => {
    if (!res.data.currentUser || !res.data.currentUser.get('affiliate')) {
        return res.redirect('/');
    }
    return res.render('ambassador/program/faq', res.data);
});

router.get('/program/resources', (req, res) => {
    if (!res.data.currentUser || !res.data.currentUser.get('affiliate')) {
        return res.redirect('/');
    }
    return res.render('ambassador/program/resources', res.data);
});

router.get('/program/marketing-tools', (req, res) => {
    if (!res.data.currentUser || !res.data.currentUser.get('affiliate')) {
        return res.redirect('/');
    }

    const affiliateQuery = new Parse.Query(Parse.Object.extend('Affiliate'));
    const courseQuery = new Parse.Query(Parse.Object.extend('Course'));
    courseQuery.limit(1000);
    affiliateQuery.get(res.data.currentUser.get('affiliate').id).then(affiliate => {
         courseQuery.include('instructor');
         courseQuery.find().then(courses => {
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
                res.data.courses = courses;
                res.data.affiliate = affiliate;
                return res.render('ambassador/program/marketing-tools', res.data);
            });
        });
    });
});

router.post('/application', (req, res) => {
    if (req.isAuthenticated()) {
        AmbassadorService.mwCreateAmbassador(req.user._json.parse_api_key, (result) => {
            console.log('APPPPPPPPPP');
            return res.redirect('/affiliates/program');
        });
    } else {
        console.log('FAIL APPP');
        return res.render('/', res.data);
    }
});

router.get('/program/profile', (req, res) => {
    if (!res.data.currentUser || !res.data.currentUser.get('affiliate')) {
        return res.redirect('/');
    }
    const amboQuery = new Parse.Query(Parse.Object.extend('Ambassador'));
    amboQuery.get(res.data.currentUser.get('ambassador').id).then(ambo => {
        console.log('AMBO' + JSON.stringify(ambo));
        res.data.ambo = ambo;
        return res.render('ambassador/program/profile', res.data);
    });
    
});

router.post('/program/profile/w9', (req, res) => {
    console.log('W9::' + JSON.stringify(req.body));
    // console.log(res);
    return res.redirect('/affiliates/program/profile');
});

router.post('/program/onboard', (req, res) => {
    if (!res.data.currentUser || !res.data.currentUser.get('ambassador')) {
        return res.redirect('/');
    }
    const Ambassador = Parse.Object.extend('Ambassador');
    const finAmbassador = new Ambassador();
    finAmbassador.set('firstName', req.body.firstName);
    finAmbassador.set('lastName', req.body.lastName);
    finAmbassador.set('email', req.body.email);
    finAmbassador.set('phone', req.body.phone);
    finAmbassador.set('streetAddress', req.body.streetAddress);
    finAmbassador.set('city', req.body.city);
    finAmbassador.set('state', req.body.state);
    finAmbassador.set('zip', req.body.zip);
    finAmbassador.set('dateOfBirth', req.body.dateOfBirth);
    finAmbassador.set('paypal', req.body.paypal);
    finAmbassador.id = res.data.currentUser.get('ambassador').id;
    finAmbassador.save().then(ambo => {
        console.log('Fin Ambo');
        res.status(200).send(ambo);
    }, error => {
        res.status(200).send({success: false, error: error.message});
    });
});
module.exports = router;