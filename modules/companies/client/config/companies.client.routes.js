(function () {
  'use strict';

  angular
    .module('companies.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('companies', {
        abstract: true,
        url: '/companies',
        template: '<ui-view/>'
      })
      .state('companies.list', {
        url: '',
        templateUrl: '/modules/companies/client/views/list-companies.client.view.html',
        controller: 'CompaniesListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('companies.view', {
        url: '/:companyId',
        templateUrl: '/modules/companies/client/views/view-company.client.view.html',
        controller: 'CompaniesController',
        controllerAs: 'vm',
        resolve: {
          companyResolve: getCompany
        },
        data: {
          pageTitle: '{{ companyResolve.title }}',
          roles: ['user', 'admin']
        }
      });
  }

  getCompany.$inject = ['$stateParams', 'CompaniesService'];

  function getCompany($stateParams, CompaniesService) {
    return CompaniesService.get({
      companyId: $stateParams.companyId
    }).$promise;
  }
}());
