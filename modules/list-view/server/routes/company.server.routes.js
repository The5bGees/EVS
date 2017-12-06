'use strict';

/**
 * Module dependencies.
 */

//TODO: Company Policy
// var policy = require('../policies/list-view.server.policy.js'),
let controller = require('../controllers/company.server.controller.js');

module.exports = function (app) {

  // Company upload icon
  app.route('/api/company/icon')
    .post(controller.uploadIcon);
  app.route('/api/company/icon')
    .delete(controller.deleteIcon);

  // Company collection routes
  app.route('/api/company').all()
    .get(controller.list)
    .post(controller.create);

  // Single Company routes
  app.route('/api/company/:id').all()
    .get(controller.read)
    .put(controller.update)
    .delete(controller.delete);

  // Finish by binding the report middleware
  app.param('id', controller.ParamID);
};
