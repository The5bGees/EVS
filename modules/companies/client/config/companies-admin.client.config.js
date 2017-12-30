(function () {
  'use strict';

  // Configuring the Companies Admin module
  angular
    .module('companies.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Companies',
      state: 'admin.companies.list'
    });
  }
}());
