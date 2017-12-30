(function () {
  'use strict';

  // Configuring the Oils Admin module
  angular
    .module('oils.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Oils',
      state: 'admin.oils.list'
    });
  }
}());
