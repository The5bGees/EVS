'use strict';

/**
 * Module dependencies.
 */
// var oilPolicy = require('../policies/list-view.server.policy.js'),
let reportController = require('../controllers/report.server.controller.js');

module.exports = function (app) {

  // Read pdf file
  app.route('/api/report/pdf')
    .get(reportController.getPdf);

  // Report upload pdf
  app.route('/api/report/upload/simplifyPdf')
    .post(reportController.uploadSimplifyPdf);
  // Report upload pdf
  app.route('/api/report/upload/extendedPdf')
    .post(reportController.uploadExtendedPdf);


  // Oil collection routes
  app.route('/api/report').all()
    .get(reportController.list)
    .post(reportController.create);

  // Single Oil routes
  app.route('/api/report/:reportId').all()
    .get(reportController.read)
    .put(reportController.update)
    .delete(reportController.delete);

  // Finish by binding the report middleware
  app.param('reportId', reportController.reportByID);
};
