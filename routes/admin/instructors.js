const express = require('express');
const router = express.Router();
const Parse = require('../../modules/parse.js');

const AdminService = require('../../services/admin/index.js');
const AdminCourseService = require('../../services/admin/courses.js');
const AdminInstructors = require('../../services/admin/instructors.js');
const BooksService = require('../../services/books.js');

const InstructorModel = Parse.Object.extend('Instructor');

const MarkdownIt = require('markdown-it');
const markdown = new MarkdownIt();
const toMarkdown = require('to-markdown');
// const formidable = require('formidable');

const formidable = require('express-formidable');
const FileReader = require('filereader');
const json2csv = require('json2csv');

router.use(AdminService.mwGetAdminUser);

router.get('/',
  [
    AdminInstructors.mwGetInstructors,
  ], (req, res) => {

    res.render('admin/instructor/index', res.data);
});

router.get('/affiliateList',
  [
    AdminInstructors.mwGetInstructors,
  ], (req, res) => {

    res.render('admin/instructor/affiliateList', res.data);
  });

router.post('/getStudentBody',
  [
    AdminInstructors.mwGetInstructorStudentBody,
  ], (req, res) => {

    const csv = json2csv({ data: res.data.studentList });

    res.set('Content-Type', 'text/csv');
    res.attachment('StudentBodyList.csv');
    res.status(200).send(csv);
});

router.get('/add', (req, res) => {
  res.data.formType = 'Add';
  res.data.values = {};
  res.data.values.published = false;
  res.render('admin/instructor/addInstructor', res.data);

});

router.get('/edit',
  [
    AdminInstructors.mwGetInstructorInfo,
  ], (req, res) => {

    res.data.formType = 'Edit';
    res.data.instructorId = req.query.id;
    const values = {};

    values.name = res.data.instructor.get('name');
    values.vanity = res.data.instructor.get('vanity');
    values.shortBio = res.data.instructor.get('shortBio');
    values.longBio = res.data.instructor.get('longBio');
    values.socialFacebook = res.data.instructor.get('socialFacebook');
    values.socialGoogle = res.data.instructor.get('socialGoogle');
    values.socialPinterest = res.data.instructor.get('socialPinterest');
    values.socialInstagram = res.data.instructor.get('socialInstagram');
    values.socialLinkedIn = res.data.instructor.get('socialLinkedIn');
    values.socialYouTube = res.data.instructor.get('socialYouTube');
    values.socialTwitter = res.data.instructor.get('socialTwitter');
    values.published = res.data.instructor.get('published');

    values.statusExpert = false;
    values.statusInstructor = true;
    if(res.data.instructor.get('expert')) {
      values.statusExpert = true;
      values.statusInstructor = false
    }

    res.data.values = values;
    res.data.libs.markdown = markdown;

    res.render('admin/instructor/addInstructor', res.data);
});

router.get('/info',
  [
    AdminCourseService.mwGetCourses,
    AdminCourseService.mwGetEnrollments,
    AdminInstructors.mwGetInstructorInfo,
    AdminInstructors.mwGetInstructorEmail,
    BooksService.mwGetForInstructor,
  ], (req, res) => {

    res.data.libs.markdown = markdown;
    res.render('admin/instructor/info', res.data);

});

router.get('/deactivate', (req, res) => {
  const data = {
    id: req.query.id,
    status: false,
  }
  AdminInstructors.mwSetInstructorActive(data, (e) => {
    // TODO: Need to get affiliate and update instructors
    if (e) {
      res.redirect('edit?id=' + req.query.id);
    } else {
      res.render('edit?id=' + req.query.id);
    }
  });
});

router.get('/activate', (req, res) => {
  const data = {
    id: req.query.id,
    status: true,
  }
  AdminInstructors.mwSetInstructorActive(data, (e) => {
    // TODO: Need to get affiliate and update instructors
    if (e) {
      res.redirect('edit?id=' + req.query.id);
    } else {
      res.render('edit?id=' + req.query.id);
    }
  });
});

router.post('/add', (req, res) => {

  let instructorName;
  instructorName = req.body.name;

  const slug = instructorName.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');

  const markdownContent = toMarkdown(req.body.longBio);

  const expertStatus = (req.body.status === 'expert') ? true : false;

  const instructorData = {
    name: req.body.name,
    shortBio: req.body.shortBio,
    longBio: markdownContent,
    socialGoogle: req.body.socialGoogle,
    socialTwitter: req.body.socialTwitter,
    socialFacebook: req.body.socialFacebook,
    socialLinkedIn: req.body.socialLinkedIn,
    socialPinterest: req.body.socialPinterest,
    socialInstagram: req.body.socialInstagram,
    socialYouTube: req.body.socialYouTube,
    username: slug,
    published: Boolean(req.body.published),
    vanity: req.body.vanity,
    order: 10,
    expert: expertStatus,
  }

  const options = {
    type: req.body.formType,
    instructorId: req.body.instructorId || '',
  }

  // write into DB
  AdminInstructors.mwInsertInstructorInfo(instructorData, options, (e) => {
    // TODO: Need to get affiliate and update instructors
    if (e) {
      res.redirect('/admin/instructors');
    } else {
      res.render('/admin/instructor/add', instructorData);
    }
  });

});


router.post('/edit', (req, res) => {

  let instructorName;
  instructorName = req.body.name;

  const slug = instructorName.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');

  const markdownContent = toMarkdown(req.body.longBio);

  const expertStatus = (req.body.status === 'expert') ? true : false;

  const instructorData = {
    name: req.body.name,
    shortBio: req.body.shortBio,
    longBio: markdownContent,
    socialGoogle: req.body.socialGoogle,
    socialTwitter: req.body.socialTwitter,
    socialFacebook: req.body.socialFacebook,
    socialLinkedIn: req.body.socialLinkedIn,
    socialPinterest: req.body.socialPinterest,
    socialInstagram: req.body.socialInstagram,
    socialYouTube: req.body.socialYouTube,
    username: slug,
    vanity: req.body.vanity,
    expert: expertStatus,
  }

  const options = {
    type: req.body.formType,
    instructorId: req.body.instructorId || '',
  }

  // write into DB
  AdminInstructors.mwInsertInstructorInfo(instructorData, options, (e) => {
    // TODO: Need to get affiliate and update instructors
    if (e) {
      res.redirect('/admin/instructors/info?id=' + req.body.instructorId);
    } else {
      res.render('/admin/instructor/add', instructorData);
    }
  });

});


router.get('/addBook', (req, res) => {
  res.data.instructorId = req.query.id;

  res.render('admin/instructor/addBook', res.data);

});

router.post('/addBook', (req, res) => {

  const book = {
    title: req.body.bookTitle,
    link: req.body.bookLink,
    cover: req.body.bookCover,
    onCourse: true,
    instructor: {"__type":"Pointer","className":"Instructor","objectId":req.body.instructorId},
  }

  AdminInstructors.mwAddUpdateBook(book, (e) => {
    if (e) {
      res.redirect('/admin/instructors/info?id=' + req.body.instructorId);
    } else {
      res.redirect('/admin/instructors/info?id=' + req.body.instructorId);
    }
  });

});


router.post('/uploadProfileHeader', formidable(), (req, res) => {

  const instructorId = req.fields.instructorId;
  console.log('InstructorID :: ' + instructorId);

  const reader = new FileReader();

  const fileImage = req.files.profileHeader;

  reader.addEventListener('load', function() {
    const parseFile = new Parse.File(fileImage.name, {base64: reader.result}, fileImage.type);

    parseFile.save().then(function() {
      const instructorHeader = new InstructorModel();
      instructorHeader.id = instructorId;
      instructorHeader.set('profileHeader', parseFile);
      instructorHeader.save().then(
        () => {  res.redirect('/admin/instructors/info?id=' + instructorId); },
        (error) => {
          // TODO: show error form with error message
          console.log(error);
          res.redirect('/admin/instructors/info?id=' + instructorId);
        }
      );
    }, function(error) {
      // The file either could not be read, or could not be saved to Parse.
      console.log('parseFile save error');
      console.log(error);
      res.redirect('/admin/instructors/info?id=' + instructorId);
    });
  }, false);

  reader.readAsDataURL(fileImage);

});

router.post('/uploadProfileAvatar', formidable(), (req, res) => {
  console.log('In Profile Avatar Upload');

  const instructorId = req.fields.instructorId;
  console.log('InstructorID :: ' + instructorId);

  const reader = new FileReader();

  const fileImage = req.files.profileAvatar;

  reader.addEventListener('load', function() {
    const parseFile = new Parse.File(fileImage.name, {base64: reader.result}, fileImage.type);

    parseFile.save().then(function() {
      const instructorHeader = new InstructorModel();
      instructorHeader.id = instructorId;
      instructorHeader.set('avatar', parseFile);
      instructorHeader.save().then(
        () => {  res.redirect('/admin/instructors/info?id=' + instructorId); },
        (error) => {
          // TODO: show error form with error message
          console.log(error);
          res.redirect('/admin/instructors/info?id=' + instructorId);
        }
      );
    }, function(error) {
      // The file either could not be read, or could not be saved to Parse.
      console.log('parseFile save error');
      console.log(error);
      res.redirect('/admin/instructors/info?id=' + instructorId);
    });
  }, false);

  reader.readAsDataURL(fileImage);

});


router.get('/setAffiliateCode', (req, res) => {

  const instructorId = req.query.id;
  console.log('InstructorID :: ' + instructorId);

  AdminInstructors.mwSetAffiliateCode(instructorId, (e) => {
    if (e) {
      res.redirect('info?id=' + instructorId);
    } else {
      res.redirect('info?id=' + instructorId);
    }
  });
});


router.get('/setUserAuth',
  [
    AdminInstructors.mwGetInstructorInfo,
  ], (req, res) => {
    res.data.instructorId = req.query.id;

    res.render('admin/instructor/setUserAuth', res.data);
});


router.post('/setUserAuth', (req, res) => {

  const data = {
    authId: req.body.authId.trim(),
    instructorId: req.body.instructorId,
    affiliateId: req.body.affiliateId,
  }

  AdminInstructors.mwSetUserAuth(data, (e) => {
    if (e) {
      res.redirect('info?id=' + req.body.instructorId);
    } else {
      res.redirect('info?id=' + req.body.instructorId);
    }
  });



});




module.exports = router;
