const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const assets = require('express-asset-versions');

//Heroku prevent server crash https://help.heroku.com/AXOSFIXN/why-am-i-getting-h12-request-timeout-errors-in-nodejs
const timeout = require('connect-timeout')

// Services
const AuthService = require('./services/auth.js');
const UserService = require('./services/user.js');


AuthService.configurePassport();

// Main Site Routes Path
const routes = require('./routes/index');
const routesArticles = require('./routes/articles');
const routesAuth = require('./routes/auth');
const routesCourses = require('./routes/courses');
const routesBooks = require('./routes/books');
const routesCheckout = require('./routes/checkout');
const routesCruise = require('./routes/cruise');
const routesEvents = require('./routes/events');
const routesFoundations = require('./routes/foundations');
const routesInstructor = require('./routes/instructor');
const routesQuotes = require('./routes/quotes');
const routesSalespage = require('./routes/salespage');
const routesSupport = require('./routes/support');
const routesSurvey = require('./routes/survey');
const routesTeam = require('./routes/team');
const routesTerms = require('./routes/terms');
const routesAffiliates = require('./routes/affiliates');

// Dashboard Routes Path
const routesDashboard = require('./routes/dashboard/index.js');
const routesDashboardArticle = require('./routes/dashboard/article');
const routesDashboardCourse = require('./routes/dashboard/course');
const routesDashboardMarketplace = require('./routes/dashboard/marketplace');
const routesDashboardPartner = require('./routes/dashboard/partner');
const routesDashboardFilesVideo = require('./routes/dashboard/files');
const routesDashboardMessage = require('./routes/dashboard/message');
const routesDashboardVouchers = require('./routes/dashboard/vouchers');
const routesDashboardVouchersDetails = require('./routes/dashboard/vouchersdetails');

const routesStudent = require('./routes/student/index.js');
const routesStudentMessage = require('./routes/student/message');
const routeStudentRecieveMessage=require('./routes/student/message');
const routeStudentMessageInstructor= require('./routes/student/messageinstructor');
const routesStudentExplantion = require('./routes/student/explation');
const routesStudentSuggestion = require('./routes/student/suggestion');
const routeStudentVoucherinfo = require('./routes/student/index.js');
const routeStudentAddCourse = require('./routes/student/index');
const routeStudentEmailPassword = require('./routes/Student/index');


// Admin Routes Path
const routesAdmin = require('./routes/admin/index.js');
const routesAdminAssets = require('./routes/admin/assets');
const routesAdminCourse = require('./routes/admin/course');
const routesAdminArticle = require('./routes/admin/article');
const routesAdminInstructors = require('./routes/admin/instructors');
const routesAdminEnrollment = require('./routes/admin/enrollment');
const routesAdminEvent = require('./routes/admin/event');
const routesAdminUsers = require('./routes/admin/users');
const routesAdminSearch = require('./routes/admin/search');
const routesAdminOrders = require('./routes/admin/orders');
const routesAdminFiles = require('./routes/admin/files');

// Marketplace Routes Path
const routesApiMarketplace = require('./routes/api/marketplace.js');

// Vanity
const routesVanity = require('./routes/vanity');

const app = express();




// Timeout to prevent crashing
app.use(timeout('1200s'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Static assets.
const assetPath = path.join(__dirname, 'public');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(haltOnTimedout);
app.use(cookieParser());
app.use(haltOnTimedout);
app.use(AuthService.configureSession());
app.use(AuthService.Passport.initialize());
app.use(AuthService.Passport.session());
app.use(haltOnTimedout);
app.use('/public', express.static(assetPath));
app.use(express.static(assetPath));
app.use(assets('/public', assetPath));

app.use(require('./middleware/response_data.js'));
app.use(require('./middleware/config.js'));
app.use(require('./middleware/analytics.js'));
app.use(require('./middleware/current_user.js'));
app.use(require('./middleware/meta.js'));
app.use(UserService.mwCurrentUser);
app.use(haltOnTimedout);
app.use(require('./middleware/open_graph.js'));

// Main Site Routes
app.use('/', routes);
app.use('/auth', routesAuth);
app.use('/courses', routesCourses);
app.use('/books', routesBooks);
app.use('/checkout', routesCheckout);
app.use('/cruise', routesCruise);
app.use('/events', routesEvents);
app.use('/foundations', routesFoundations);
app.use('/instructors', routesInstructor);
app.use('/quotes', routesQuotes);
app.use('/salespage', routesSalespage);
app.use('/support', routesSupport);
app.use('/survey', routesSurvey);
app.use('/team', routesTeam);
app.use('/terms', routesTerms);
app.use('/affiliates', routesAffiliates)
app.use('/vanity', routesVanity);
app.use('/checkout/getcheckoutVoucherinfo',routesCheckout);

app.use('/student', routesStudent);
app.use('/student/message', routesStudentMessage);
app.use('/student/message/receivedmessage',routeStudentRecieveMessage);
app.use('/student/messageinstructor',routeStudentMessageInstructor);
app.use('/student/explanation', routesStudentExplantion);
app.use('/student/suggestion', routesStudentSuggestion);
app.use('/student/getvoucherinfo',routeStudentVoucherinfo);
app.use('/student/addtocourse',routeStudentAddCourse);
app.use('/student/update_email_password',routeStudentEmailPassword);
app.use('/student/savepassword',routeStudentEmailPassword);

// Dashboard Routes
app.use('/dashboard', routesDashboard);
app.use('/dashboard/article', routesDashboardArticle);
app.use('/dashboard/course', routesDashboardCourse);
app.use('/dashboard/marketplace', routesDashboardMarketplace);
app.use('/dashboard/partner', routesDashboardPartner);
app.use('/dashboard/files', routesDashboardFilesVideo);
app.use('/dashboard/message', routesDashboardMessage);
app.use('/dashboard/vouchers',routesDashboardVouchers);
app.use('/dashboard/vouchersdetails',routesDashboardVouchersDetails);



app.post('/dashboard/vouchers/getpromocode',routesDashboardVouchers);
app.get('/dashboard/vouchersdetails/:courseid',routesDashboardVouchersDetails);
app.get('/dashboard/vouchersdetails/:courseid/downloadcsv',routesDashboardVouchersDetails);

// Admin Routes
app.use('/admin', routesAdmin);
app.use('/admin/assets', routesAdminAssets);
app.use('/admin/course', routesAdminCourse);
app.use('/admin/article', routesAdminArticle);
app.use('/admin/instructors', routesAdminInstructors);
app.use('/admin/enrollment', routesAdminEnrollment);
app.use('/admin/event', routesAdminEvent);
app.use('/admin/users', routesAdminUsers);
app.use('/admin/search', routesAdminSearch);
app.use('/admin/orders', routesAdminOrders);
app.use('/admin/files', routesAdminFiles);

// Marketplace Routes
app.use('/api/marketplace', routesApiMarketplace);

// Articles - load last
app.use('/', routesArticles);

// Timeout Error handling
function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

// 404 error handler
app.use((req, res) => {
  res.status(404);
  res.render('404', res.data);
});

// 500 error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.data.message = err.message;
  res.data.error = (app.get('env') === 'development') ? err : null;
  res.render('error', res.data);
});


module.exports = app;
