var express = require('express');
var router = express.Router();
const Parse = require('../../modules/parse.js');
const formidable = require('express-formidable');
const FileReader = require('filereader');

const DashboardService = require('../../services/dashboard/index.js');
const LibraryModel = Parse.Object.extend('Library');

router.get('/',[DashboardService.mwGetVideo],(req,res) => {
  res.data.fileId=res.data.files.id;
  res.data.file=res.data.files.get('video');
  res.render('dashboard/files', res.data);
})

router.post('/', formidable(), (req, res) => {
  console.log('In add file route');
  const fileId = req.fields.TxtFileId;
  const reader = new FileReader();
  const fileResource = req.files.introVideo;

  reader.addEventListener('load', function() {
    const parseFile = new Parse.File(fileResource.name, {base64: reader.result}, fileResource.type);
    console.log("fileId : ",fileId);
    console.log("fileResource.name : ",fileResource.name);
    parseFile.save().then(function() {
      const libraryResource = new LibraryModel();
      libraryResource.id = fileId;
      libraryResource.set('File', parseFile);
      libraryResource.save().then(
        () => {
          res.redirect('files');
         //res.render('/dashboard/files');
        },
        (error) => {
          res.redirect('files');
         // res.render('/dashboard/files');
        }
      );
    }, function(error) {
      res.redirect('files');
      // The file either could not be read, or could not be saved to Parse.
      //res.render('/dashboard/files');
    });
   //res.render('dashboard/files');
  }, false);

  reader.readAsDataURL(fileResource);
  
});


module.exports = router;