(function () {
  'use strict';

  angular
    .module('reports')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
   /* menuService.addMenuItem('topbar', {
      title: 'Reports',
      state: 'articles',
      type: 'dropdown'
      // roles: ['user', 'admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'articles', {
      title: 'List Articles',
      state: 'articles.list',
      roles: ['user', 'admin']
    });*/
  }
}());
