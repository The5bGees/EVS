'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller'),
    stripe = require('stripe')('sk_test_mdT1xiWtIVgQn7VUme8eNfq8'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

  // Setting up the users profile api
  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);

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

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
