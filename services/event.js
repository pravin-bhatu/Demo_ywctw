const Parse = require('../modules/parse.js');

class EventService {


  static mwGetEventBySlug(req, res, next) {
    console.log('in mwGetEventBySlug');
    console.log(req.params.slug);

    const query = new Parse.Query(Parse.Object.extend('Event'));
    query.equalTo('slug', req.params.slug);
    query.first().then(event => {
      console.log(event);
      res.data.event = event;
      return next();
    });
  }


}

module.exports = EventService;
