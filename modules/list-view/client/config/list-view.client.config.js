'use strict';

// Configuring the Articles module
angular.module('list-view').run(['menuService',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'EVS Database',
      state: 'list-view'
      // roles: ['guest','user', 'admin']
    });
  }
]);
