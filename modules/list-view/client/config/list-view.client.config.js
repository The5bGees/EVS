'use strict';

// Configuring the Articles module
angular.module('list-view').run(['menuService',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'EVS DATABASE',
      state: 'list-view',
      roles: ['user', 'admin'] //everyone can see it
    });
  }
]);
