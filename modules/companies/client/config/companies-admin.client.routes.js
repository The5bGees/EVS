(function () {
  'use strict';

  angular
    .module('companies.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.companies', {
        abstract: true,
        url: '/companies',
        template: '<ui-view/>'
      })
      .state('admin.companies.list', {
        url: '',
        templateUrl: '/modules/companies/client/views/admin/list-companies.client.view.html',
        controller: 'CompaniesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.companies.create', {
        url: '/create',
        templateUrl: '/modules/companies/client/views/admin/form-company.client.view.html',
        controller: 'CompaniesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          companyResolve: newCompany
        }
      })
      .state('admin.companies.edit', {
        url: '/:companyId/edit',
        templateUrl: '/modules/companies/client/views/admin/form-company.client.view.html',
        controller: 'CompaniesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ companyResolve.title }}'
        },
        resolve: {
          companyResolve: getCompany
        }
      });
  }

  getCompany.$inject = ['$stateParams', 'CompaniesService'];

  function getCompany($stateParams, CompaniesService) {
    return CompaniesService.get({
      companyId: $stateParams.companyId
    }).$promise;
  }

  newCompany.$inject = ['CompaniesService'];

  function newCompany(CompaniesService) {
    return new CompaniesService();
  }
}());
