'use strict';

// Configuring the Articles module
angular.module('list_view').run(['menuService',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'List View',
      state: 'list_view'
      // roles: ['user', 'admin'] //everyone can see it
    });
  }
]);
