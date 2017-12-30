(function (app) {
  'use strict';

  app.registerModule('reports', ['core']);
  app.registerModule('reports.admin', ['core.admin']);
  app.registerModule('reports.admin.routes', ['core.admin.routes']);
  app.registerModule('reports.services');
  app.registerModule('reports.routes', ['ui.router', 'core.routes', 'reports.services']);
}(ApplicationConfiguration));
