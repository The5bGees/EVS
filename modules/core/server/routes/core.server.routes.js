'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller'),
    stripe = require('stripe')('sk_live_EtOt3H0V0qAiUqlWqYo1T8Re'),
    path = require('path'),
    config = require(path.resolve('./config/config')),
    mongoose = require('mongoose'),
    nodemailer = require('nodemailer'),
    async = require('async'),
    User = mongoose.model('User');

  var smtpTransport = nodemailer.createTransport(config.mailer.options);


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
        },
        function (err, subscription) {});
      }
      if (request.body.type.toString() === 'customer.updated') {
        User.findOne({ email: event_json.email.toString() }, function (err, user) {
          if (err) {
            throw err;
          }
          else {
            response.render('modules/users/server/templates/update-card-confirm', {
              name: user.displayName,
              appName: config.app.title
            }, function (err, emailHTML) {
              var mailOptions = {
                to: user.email,
                from: config.mailer.from,
                subject: 'A new card has been added to your account',
                html: emailHTML
              };
              smtpTransport.sendMail(mailOptions, function (err) {
                if (err) {
                  throw err;
                }
              });
            });
          }
        });
      }
    }

    if (event_json.object.toString() === 'subscription') {
      if(event_json.status.toString() === 'active') {
        User.findOneAndUpdate({ stripeID: event_json.customer.toString() }, { roles: 'user', stripeSubscription: event_json.id.toString() }, function (err, entry) {
          if (err) throw err;
        });
      }
      if(event_json.status.toString() === 'canceled') {
        stripe.customers.del(event_json.customer.toString(), function (err, confirmation) {});
        User.findOne({ stripeID: event_json.customer.toString() }, function (err, user) {
          if (err) {
            throw err;
          }
          else {
            response.render('modules/users/server/templates/close-confirm', {
              name: user.displayName,
              appName: config.app.title
            }, function (err, emailHTML) {
              var mailOptions = {
                to: user.email,
                from: config.mailer.from,
                subject: 'Your account has been closed',
                html: emailHTML
              };
              smtpTransport.sendMail(mailOptions, function (err) {
                if (err) {
                  throw err;
                }
              });
            });
            User.findOneAndRemove({ stripeID: event_json.customer.toString() }, function (err, user) {
              if (err) throw err;
            });
          }
        });
      }
      if (request.body.type.toString()=== 'customer.subscription.updated') {
        User.findOne({ stripeID: event_json.customer.toString() }, function (err, user) {
          if (err) {
            throw err;
          }
          else {
            response.render('modules/users/server/templates/cancel-confirm', {
              name: user.displayName,
              appName: config.app.title
            }, function (err, emailHTML) {
              var mailOptions = {
                to: user.email,
                from: config.mailer.from,
                subject: 'Your subscription has been canceled',
                html: emailHTML
              };
              smtpTransport.sendMail(mailOptions, function (err) {
                if (err) {
                  throw err;
                }
              });
            });
          }
        });
      }
    }

    if (event_json.object.toString() === 'invoice') {
      if (event_json.paid.toString() === 'false') {
        User.findOneAndUpdate({ stripeID: event_json.customer.toString() }, { roles: 'guest'}, function (err, entry) {
          if (err) throw err;
        });
      }
      if (event_json.paid.toString() === 'true') {
        User.findOneAndUpdate({ stripeID: event_json.customer.toString() }, { roles: 'user'}, function (err, entry) {
          if (err) throw err;
        });
      }
    }
    response.sendStatus(200);
  });

  // Define application route
  app.route('/*').get(core.renderIndex);
};
