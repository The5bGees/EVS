'use strict';

/**
 * Module dependencies.
 */
var oilPolicy = require('../policies/list_view.server.policy'),
    oil = require('../controllers/oil.server.controller');

module.exports = function (app) {
    // Articles collection routes
    app.route('/api/oil').all(oilPolicy.isAllowed)
        .get(oil.list)
        .post(oil.create);

    // Single article routes
    app.route('/api/oil/:oilId').all(oilPolicy.isAllowed)
        .get(oil.read)
        .put(oil.update)
        .delete(oil.delete);

    // Finish by binding the article middleware
    app.param('oilId', oil.articleByID);
};
