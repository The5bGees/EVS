(function () {
  'use strict';

  angular
    .module('reports.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.reports', {
        abstract: true,
        url: '/reports',
        template: '<ui-view/>'
      })
      .state('admin.reports.list', {
        url: '',
        templateUrl: '/modules/reports/client/views/admin/list-reports.client.view.html',
        controller: 'ReportsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.reports.create', {
        url: '/create',
        templateUrl: '/modules/reports/client/views/admin/form-report.client.view.html',
        controller: 'ReportsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          reportResolve: newReport
        }
      })
      .state('admin.reports.edit', {
        url: '/:reportId/edit',
        templateUrl: '/modules/reports/client/views/admin/form-report.client.view.html',
        controller: 'ReportsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ reportResolve.title }}'
        },
        resolve: {
          reportResolve: getReport
        }
      });
  }

  getReport.$inject = ['$stateParams', 'ReportsService'];

  function getReport($stateParams, ReportsService) {
    return ReportsService.get({
      reportId: $stateParams.reportId
    }).$promise;
  }

  newReport.$inject = ['ReportsService'];

  function newReport(ReportsService) {
    return new ReportsService();
  }
}());
