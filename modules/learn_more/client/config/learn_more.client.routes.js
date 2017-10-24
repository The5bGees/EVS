'use strict';


// Configure the 'chat' module routes
angular.module('learn_more').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('learn_more', {
        url: '/learn_more',
        templateUrl: 'modules/learn_more/client/views/learn_more.client.view.html'
      });
  }
]);
