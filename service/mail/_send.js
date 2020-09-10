const aws = require('../../modules/aws.js');

const ses = new aws.SES({ apiVersion: '2010-12-01' });

const FROM = 'no-reply@youwillchangetheworld.com';

/**
 * TODO: Write some documentation on this.
 * TODO: Allow for multiple recipients.
 * TODO: Allow for HTML emails, perhaps create a way to store templates.
 */
module.exports = (to = '', from = FROM, message = {}) => new Promise((resolve, reject) => {
  ses.sendEmail({
    Source: from,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: { Data: message.subject },
      Body: {
        Text: { Data: message.data },
      },
    },
  }, (err, data) => {
    if (err) return reject(err);
    return resolve(data);
  });
});
