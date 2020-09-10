// Module for sending events to queues.

const Firebase = require('firebase');

exports.push = (event, callback) => {
  if (!event.type || !event.action || !event.data) {
    if (callback) callback('event missing attributes');
    return;
  }
  const ref = new Firebase('https://ywctw.firebaseio.com/queue-events/tasks');
  ref.push(event, (error) => {
    if (callback) callback(error);
  });
};
