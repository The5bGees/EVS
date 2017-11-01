'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  app.post('/api/users/stripe', function (request, response) {
    // Retrieve the request's body and parse it as JSON
    var event_json = JSON.parse(request.body);

    /*if (event_json.object === 'customer') {
      User.findOneAndUpdate({ email: event_json.email }, { stripeID: event_json.id }, function (err, entry) {
        if (err) throw err;
      });
    }

    if (event_json.object === 'charge') {
      if (event_json.failure_code === 'null') {
        User.findOneAndUpdate({ stripeID: event_json.customer }, { stripeStatus: '1' }, function (err, entry) {
          if (err) throw err;
        });
      } else {
        User.findOneAndUpdate({ stripeID: event_json.customer }, { stripeStatus: '0' }, function (err, entry) {
          if (err) throw err;
        });
      }
    }*/

    response.send(200);
  });

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  app.route('/*').get(core.renderIndex);
};
