const Parse = require('../../modules/parse.js');

const EventModel = Parse.Object.extend('Event');


class AdminEventService {

  static mwGetEvents(req, res, next) {
    const eventsQuery = new Parse.Query(Parse.Object.extend('Event'));
    // eventsQuery.ascending('name'); Change to order by date added
    eventsQuery.find().then(events => {
      res.data.events = events;
      return next();
    });
  }


  static mwAddUpdateEvent(data, options, callback) {
    console.log('FormType :: ' + options.type);

    const event = new EventModel();
    if (options.type === 'Edit') {
      event.id = options.eventId;
    }
    event.save(data).then((result) => {
      callback(true, result.id);
    }, error => {
      console.log('Error :: ' + JSON.stringify(error));
      callback(false);
    });
  }

  static mwGetEvent(req, res, next) {
    const query = new Parse.Query(Parse.Object.extend('Event'));
    query.equalTo('objectId', req.query.id);
    query.first().then(event => {
      res.data.event = event;
      return next();
    });
  }

}

module.exports = AdminEventService;


