(function () {
  'use strict';

  angular
    .module('companies')
    .controller('CompaniesController', CompaniesController);

  CompaniesController.$inject = ['$scope', 'companyResolve', 'ReportsService', 'Authentication'];

  function CompaniesController($scope, company, ReportsService, Authentication) {
    var vm = this;

    vm.company = company;
    vm.authentication = Authentication;
    vm.reports = ReportsService.query();

  }
}());
