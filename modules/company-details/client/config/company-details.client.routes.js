'use strict';


// Configure the 'company details' module routes
angular.module('company-details').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('company-details', {
        url: '/company-details',
        templateUrl: 'modules/company-details/client/views/company-details.client.view.html',
        params:{
          'company' : 'empty'
        }
      })
  }
]);
