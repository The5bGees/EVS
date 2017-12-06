'use strict';

// Configuring the Articles module
angular.module('list-view').run(['menuService',
  function (menuService) {
    // Add the articles dropdown item
    menuService.addMenuItem('topbar', {
      title: 'EVS DATABASE',
      state: 'list-view',
      roles: ['user', 'admin']
    });

    menuService.addMenuItem('topbar', {
      title: 'Manage DB',
      state: 'list-view-admin',
      roles: ['admin']
    });

  }
]);
