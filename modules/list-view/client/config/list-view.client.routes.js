'use strict';

// Configure the 'chat' module routes
angular.module('list-view').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('list-view', {
        url: '/list-view',
        controller: 'ListViewController',
        templateUrl: '/modules/list-view/client/views/list-view.client.view.html',
        data: {
          roles: ['user','admin']
        }
    })
      .state('list-view-admin',{
        url: '/list-view',
        controller: 'ListViewAdminController',
        templateUrl: '/modules/list-view/client/views/list-view-admin.client.view.html',
        data: {
          roles: ['admin']
        }
      });
  }
]);
