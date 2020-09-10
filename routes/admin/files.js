var express = require('express');
var router = express.Router();
const Parse = require('../../modules/parse.js');
const formidable = require('express-formidable');
const FileReader = require('filereader');

const VimeoService = require('../../services/admin/vimeovideo.js');
const AdminService = require('../../services/admin/index.js');
const LibraryModel = Parse.Object.extend('Library');

router.get('/',[AdminService.mwGetVideo],(req,res) => {
  res.data.fileId=res.data.files.id;
  res.data.file=res.data.files.get('video');
  res.render('admin/files/index', res.data);
})

router.post('/',[VimeoService.mwVideoUploadVimeo], formidable(), (req, res) => {
  const fileId = req.fields.TxtFileId;
  const fileResource = req.files.introVideo;
  // let file_name = fileResource.name;
  let file_name = fileResource;
  let bytes_total = fileResource.size;
  res.data.client.upload(
    file_name,
    {
      'name': ' Admin VIDEO',
      'description': 'YOUWILLCHANGETHEWORLD INSTRUCTOR VIDEO.'
    },
    function (uri) {
      console.log('Your video URI is: ' + uri);
    },
    function (bytes_uploaded, bytes_total) {
      var percentage = (bytes_uploaded / bytes_total * 100).toFixed(2)
      console.log(bytes_uploaded, bytes_total, percentage + '%')
    },
    function (error) {
      console.log('Failed because: ' + error)
    }
  )
});

// router.post('/', formidable(), (req, res) => {
//   console.log('In add file route');
//   const fileId = req.fields.TxtFileId;
//   const reader = new FileReader();
//   const fileResource = req.files.introVideo;

//   reader.addEventListener('load', function() {
//     const parseFile = new Parse.File(fileResource.name, {base64: reader.result}, fileResource.type);
//     console.log("fileId : ",fileId);
//     console.log("fileResource.name : ",fileResource.name);
//     console.log("fileResource.type : ",fileResource.type);
//     parseFile.save().then(function() {
//       const libraryResource = new LibraryModel();
//       libraryResource.id = fileId;
//       libraryResource.set('File', parseFile);
//       libraryResource.save().then(
//         () => {
//           console.log("File Upload Sucessfully");
//           res.redirect('files');
//         },
//         (error) => {
//           console.log(error);
//           res.redirect('files');
//         }
//       );
//     }, function(error) {
//       res.redirect('files');
//     });
//   }, false);
//   reader.readAsDataURL(fileResource);
// });





module.exports = router;