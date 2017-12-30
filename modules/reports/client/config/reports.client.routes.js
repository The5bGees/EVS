(function () {
  'use strict';

  angular
    .module('reports.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('reports', {
        abstract: true,
        url: '/reports',
        template: '<ui-view/>'
      })
      .state('reports.list', {
        url: '',
        templateUrl: '/modules/reports/client/views/list-reports.client.view.html',
        controller: 'ReportsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('reports.view', {
        url: '/:reportId',
        templateUrl: '/modules/reports/client/views/view-report.client.view.html',
        controller: 'ReportsController',
        controllerAs: 'vm',
        resolve: {
          reportResolve: getReport
        },
        data: {
          pageTitle: '{{ reportResolve.title }}',
          roles: ['user', 'admin']
        }
      });
  }

  getReport.$inject = ['$stateParams', 'ReportsService'];

  function getReport($stateParams, ReportsService) {
    return ReportsService.get({
      reportId: $stateParams.reportId
    }).$promise;
  }
}());
