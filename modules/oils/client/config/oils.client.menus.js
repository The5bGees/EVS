(function () {
  'use strict';

  angular
    .module('oils')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'EVS DATABASE',
      state: 'oils.list',
      roles: ['user', 'admin']
    });
  }
}());
