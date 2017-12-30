(function () {
  'use strict';

  // Configuring the Reports Admin module
  angular
    .module('reports.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Reports',
      state: 'admin.reports.list'
    });
  }
}());
