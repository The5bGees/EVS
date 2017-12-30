(function (app) {
  'use strict';

  app.registerModule('companies', ['core']);
  app.registerModule('companies.admin', ['core.admin']);
  app.registerModule('companies.admin.routes', ['core.admin.routes']);
  app.registerModule('companies.services');
  app.registerModule('companies.routes', ['ui.router', 'core.routes', 'companies.services']);
}(ApplicationConfiguration));
