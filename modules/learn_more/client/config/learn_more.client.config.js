'use strict';

// Configuring the Articles module
angular.module('learn_more').run(['Menus',
function (Menus) {
  // Add the articles dropdown item
  Menus.addMenuItem('topbar', {
    title: 'Learn More',
    state: 'learn_more',
    roles: ['*']  //everyone can see it
  });
}
]);
