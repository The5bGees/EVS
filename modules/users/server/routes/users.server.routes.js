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
  app.post('/api/users/token', function (request, response) {
    stripe.customers.create({
      email: request.body.email,
      source: request.body.id
    }, function (err, customer) {
      // asynchronously called
    });

    var user = request.user;
    user.roles = 'user';
    request.login(user, function (err) {
      if (err) {
        response.status(400).send(err);
      } else {
        response.json(user);
      }
    });
  });
  app.post('/api/users/updatecard', function (request, response) {
    stripe.customers.update(request.body.id, {
      source: request.body.token
    }, function (err, customer) {

    });
  });
  app.post('/api/users/cancel', function (request, response) {
    stripe.subscriptions.del(
      request.body.stripeSubscription,
      function (err, customer) {
      // asynchronously called
    });
  });

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
