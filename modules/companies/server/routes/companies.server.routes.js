'use strict';

/**
 * Module dependencies
 */
var companiesPolicy = require('../policies/companies.server.policy'),
  companies = require('../controllers/companies.server.controller');

module.exports = function (app) {
  // Company collection routes
  app.route('/api/companies').all(companiesPolicy.isAllowed)
    .get(companies.list)
    .post(companies.create);

  app.route('/api/companies/icon')
    .post(companies.uploadIcon);

  // Single company routes
  app.route('/api/companies/:companyId').all(companiesPolicy.isAllowed)
    .get(companies.read)
    .put(companies.update)
    .delete(companies.delete);

  // Finish by binding the article middleware
  app.param('companyId', companies.companyByID);
};
