(function () {
  'use strict';

  angular
    .module('oils.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.oils', {
        abstract: true,
        url: '/oils',
        template: '<ui-view/>'
      })
      .state('admin.oils.list', {
        url: '',
        templateUrl: '/modules/oils/client/views/admin/list-oils.client.view.html',
        controller: 'OilsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.oils.create', {
        url: '/create',
        templateUrl: '/modules/oils/client/views/admin/form-oil.client.view.html',
        controller: 'OilsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          oilResolve: newOil
        }
      })
      .state('admin.oils.edit', {
        url: '/:oilId/edit',
        templateUrl: '/modules/oils/client/views/admin/form-oil.client.view.html',
        controller: 'OilsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ oilResolve.title }}'
        },
        resolve: {
          oilResolve: getOil
        }
      });
  }

  getOil.$inject = ['$stateParams', 'OilsService'];

  function getOil($stateParams, OilsService) {
    return OilsService.get({
      oilId: $stateParams.oilId
    }).$promise;
  }

  newOil.$inject = ['OilsService'];

  function newOil(OilsService) {
    return new OilsService();
  }
}());
