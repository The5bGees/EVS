'use strict';

/**
 * Module dependencies.
 */
// var oilPolicy = require('../policies/list-view.server.policy.js'),
let reportController = require('../controllers/report.server.controller.js');

module.exports = function (app) {

  // Report upload icon
  // app.route('/api/report/icon')
  //   .post(oilController.uploadIcon);
  // app.route('/api/report/icon')
  //   .delete(oilController.deleteIcon);

  // Report upload pdf
  // app.route('/api/report/upload/pdf')
  //   .post(oilController.uploadPdf);
  //TODO: test getPdf
  // .get(oilController.getPdf);

  // Oil collection routes
  app.route('/api/report').all()
    .get(reportController.list)
    .post(reportController.create);

  // Single Oil routes
  app.route('/api/report/:oilId').all()
    .get(reportController.read)
    .put(reportController.update)
    .delete(reportController.delete);

  // Finish by binding the report middleware
  app.param('reportId', reportController.reportByID);
};
