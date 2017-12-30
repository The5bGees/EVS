(function () {
  'use strict';

  angular
    .module('oils.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('oils', {
        abstract: true,
        url: '/oils',
        template: '<ui-view/>'
      })
      .state('oils.list', {
        url: '',
        templateUrl: '/modules/oils/client/views/list-oils.client.view.html',
        controller: 'OilsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('oils.view', {
        url: '/:oilId',
        templateUrl: '/modules/oils/client/views/view-oil.client.view.html',
        controller: 'OilsController',
        controllerAs: 'vm',
        resolve: {
          oilResolve: getOil
        },
        data: {
          pageTitle: '{{ oilResolve.title }}',
          roles: ['user', 'admin']
        }
      });
  }

  getOil.$inject = ['$stateParams', 'OilsService'];

  function getOil($stateParams, OilsService) {
    return OilsService.get({
      oilId: $stateParams.oilId
    }).$promise;
  }
}());
