'use strict';

/**
 * Module dependencies.
 */
var oilPolicy = require('../policies/list-view.server.policy.js'),
  oilController = require('../controllers/oil.server.controller.js');

module.exports = function (app) {

  // Oil upload icon
  app.route('/api/report/icon')
    .post(oilController.uploadIcon);
  app.route('/api/report/icon')
    .delete(oilController.deleteIcon);

  // Oil upload pdf
  app.route('/api/report/upload/pdf')
    .post(oilController.uploadPdf);
  //TODO: test getPdf
  // .get(oilController.getPdf);

  // Oil collection routes
  app.route('/api/report').all()
    .get(oilController.list)
    .post(oilController.create);

  // Single Oil routes
  app.route('/api/report/:oilId').all()
    .get(oilController.read)
    .put(oilController.update)
    .delete(oilController.delete);

  // Finish by binding the report middleware
  app.param('oilId', oilController.oilByID);
};
