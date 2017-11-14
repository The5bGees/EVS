'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller'),
    stripe = require('stripe')('sk_test_mdT1xiWtIVgQn7VUme8eNfq8'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  app.post('/stripe', function (request, response) {
    var event_json = request.body.data.object;
    if (event_json.object.toString() === 'customer') {
      User.findOneAndUpdate({ email: event_json.email.toString() }, { stripeID: event_json.id.toString() }, function (err, entry) {
        if (err) throw err;
      });

      if (event_json.subscriptions.total_count.toString() === '0') {
        stripe.subscriptions.create({
          customer: event_json.id,
          items: [
            {
              plan: '001'
            }
          ]
        }, function (err, subscription) {
          // asynchronously called
        });
      }
    }

    if (event_json.object.toString() === 'subscription') {
      if(event_json.status.toString() === 'active') {
        User.findOneAndUpdate({ stripeID: event_json.customer.toString() }, { roles: 'subscriber', stripeSubscription: event_json.id.toString() }, function (err, entry) {
          if (err) throw err;
        });
      }
      if(event_json.status.toString() === 'canceled') {
        User.findOneAndUpdate({ stripeID: event_json.customer.toString() }, { roles: 'user', stripeID: '', stripeSubscription: '' }, function (err, entry) {
          if (err) throw err;
        });
      }
    }
    response.sendStatus(200);
  });

  // Define application route
  app.route('/*').get(core.renderIndex);
};
