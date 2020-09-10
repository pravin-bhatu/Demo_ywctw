var express = require('express');
var router = express.Router();

const Parse = require('../../modules/parse.js');
const MessageService = require('../../services/dashboard/message.js');
const MessageModel = Parse.Object.extend('Message');
const InstructorModal = Parse.Object.extend('Instructor');

router.get('/', [MessageService.mwGetMessage], (req, res) => {
	res.render('dashboard/message', res.data);
});

router.post('/', (req, res) => {
	console.log("post The Message to student")
	const msg = req.body.message;
	const objId = req.body.TxtMsgId;
	const msgResource = new MessageModel();
	msgResource.set('reply', msg);
	msgResource.id = objId;
	msgResource.save().then(
		() => {
			console.log('Success');
			res.redirect('message');
		},
		(error) => {
			console.log(error);
			res.redirect('message');
		}
	);
});

router.post('/msgAccepted', (req, res) => {
	console.log("Message Accepted")
	const messageAccepted = req.body.chkmessgesAccepted;
	const objId = res.data.currentUser.get('instructor').id;
	const msgAcceptQuery = new InstructorModal();
	if(messageAccepted === "on"){
		msgAcceptQuery.set('messageAccept', true);
	}
	else{
		msgAcceptQuery.set('messageAccept', false);
	}
	// msgAcceptQuery.set('messageAccept', messageAccepted);
	msgAcceptQuery.id = objId;
	msgAcceptQuery.save().then(
		() => {
			console.log("Sucess") 
			res.redirect('/dashboard/message'); },
		(error) => {
			console.log(error);
			res.redirect('/dashboard/message');
		}
	);
});


module.exports = router;