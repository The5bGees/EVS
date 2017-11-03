'use strict';

// Configure the 'chat' module routes
angular.module('list-view').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('list-view', {
        url: '/list-view',
        templateUrl: 'modules/list-view/client/views/list-view.client.view.html',
        data: {
          // roles: ['user', 'admin'] // everyone can use this link
        }
      })
      .state('list-view-admin', {
        url: '/list-view-admin',
        templateUrl: 'modules/list-view/client/views/list-view-admin.client.view.html',
        data: {
          // roles: ['user', 'admin'] // everyone can use this link
        }
      });
  }
]);
