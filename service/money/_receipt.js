const Mail = require('../mail');

const _create = (data) => {
  return {
    subject: 'Receipt: YWCTW - Course Enrollment',
    message: `
      Thank you for enrolling in a course at You Will Change The World!\n\n

      ------------------------\n
      Course: ${data.course}\n
      Instructor: ${data.instructor}\n\n

      Price: ${data.price}\n
      Discount: ${data.discount}\n
      Total: ${data.total}\n\n

      Date: ${data.date}\n
      ------------------------\n\n

      https://www.youwillchangetheworld.com
    `,
  };
};

exports.send = (data) => {
  Mail.send(data.email, 'support@youwillchangetheworld.com', _create(data)).then((response) => {
    // TODO: Anything you want after a successful send.
  }).catch((err) => {
    // TODO: Log this however you want.
  });
};
