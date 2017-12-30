'use strict';

/**
 * Module dependencies
 */
var oilsPolicy = require('../policies/oils.server.policy'),
  oils = require('../controllers/oils.server.controller');

module.exports = function (app) {
  // Oil collection routes
  app.route('/api/oils').all(oilsPolicy.isAllowed)
    .get(oils.list)
    .post(oils.create);

  app.route('/api/oils/icon')
    .post(oils.uploadIcon);

  // Single Oil routes
  app.route('/api/oils/:oilId').all(oilsPolicy.isAllowed)
    .get(oils.read)
    .put(oils.update)
    .delete(oils.delete);

  // Finish by binding the article middleware
  app.param('oilId', oils.oilByID);
};
