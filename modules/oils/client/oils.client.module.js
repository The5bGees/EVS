(function (app) {
  'use strict';

  app.registerModule('oils', ['core']);
  app.registerModule('oils.admin', ['core.admin']);
  app.registerModule('oils.admin.routes', ['core.admin.routes']);
  app.registerModule('oils.services');
  app.registerModule('oils.routes', ['ui.router', 'core.routes', 'oils.services']);
}(ApplicationConfiguration));
