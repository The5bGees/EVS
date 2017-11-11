'use strict';

// Configuring the OilDetails module
angular.module('oil-details').run(['menuService',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'The oil',
      state: 'oil-details',
      roles: ['*']  //everyone can see it
    });
  }
]);
