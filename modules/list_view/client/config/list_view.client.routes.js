'use strict';

// Configure the 'chat' module routes
angular.module('list_view').config(['$stateProvider',
function ($stateProvider) {
  $stateProvider
  .state('list_view', {
    url: '/list_view',
    templateUrl: 'modules/list_view/client/views/list_view.client.view.html',
    data: {
      roles: ['user','admin'] // everyone can use this link
    }
  });
}
]);
