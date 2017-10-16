'use strict';

/**
 * Module dependencies.
 */
var oilPolicy = require('../policies/list_view.server.policy.js'),
    oilController = require('../controllers/oil.server.controller.js');

module.exports = function (app) {
    // Oil collection routes
    app.route('/api/oil').all(oilPolicy.isAllowed)
        .get(oilController.list)
        .post(oilController.create);

    // Single Oil routes
    app.route('/api/oil/:oilId').all(oilPolicy.isAllowed)
        .get(oilController.read)
        .put(oilController.update)
        .delete(oilController.delete);

    // Finish by binding the oil middleware
    app.param('oilId', oilController.oilByID);
};
