const Parse = require('../../modules/parse.js');

const MessageModel = Parse.Object.extend('Message');

class MessageService {
	static mwGetMessage = (req, res, next) => {
		if (res.data.currentUser.get('instructor').get('messageAccept')) {
			const msgQuery = new Parse.Query(MessageModel);
			msgQuery.equalTo('instructor', { "__type": "Pointer", "className": "Instructor", "objectId": res.data.currentUser.get('instructor').id });
			msgQuery.include('user');
			msgQuery.find().then(allmessage => {
				res.data.allmessage = allmessage;
				return next();
			}, error => {
				res.data.allmessage = [];
				return next();
			});
		}
		else {
			res.data.allmessage = [];
			return next();
		}

	}
}

module.exports = MessageService;