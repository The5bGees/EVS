'use strict';


// Configure the 'oil details' module routes
angular.module('oil-details').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('oil-details', {
        url: '/oil-details',
        templateUrl: 'modules/oil-details/client/views/oil-details.client.view.html'
      })
  }
]);
