'use strict';

// Configuring the Articles module
angular.module('learn_more').run(['menuService',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'The Team',
      state: 'learn_more',
      roles: ['*']  //everyone can see it
    });
  }
]);
