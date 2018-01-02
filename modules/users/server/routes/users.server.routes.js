'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller'),
    stripe = require('stripe')('sk_live_EtOt3H0V0qAiUqlWqYo1T8Re'),
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
    User.findOneAndUpdate({ email: request.body.email }, { roles: 'user' }, function (err, user) {
      if (err) throw err;
    });
    User.findOne({ email: request.body.email }, function (err, user) {
      if (err) {
        throw err;
      } else {
        user.password = undefined;
        user.salt = undefined;
        request.login(user, function (err) {
          if (err) {
            response.status(400).send(err);
          } else {
            response.json(user);
          }
        });
      }
    });
  });
  app.post('/api/users/updatecard', function (request, response) {
    stripe.customers.update(request.body.id, {
      source: request.body.token
    }, function (err, customer) {

    });
    response.send({ message: 'Payment Updated.' });
  });
  app.post('/api/users/cancel', function (request, response) {
    stripe.subscriptions.del(request.body.stripeSubscription, {
      at_period_end: true
    }, function (err, customer) {
      // asynchronously called
    });
    response.send({ message: 'Subscription canceled.' });
  });

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
