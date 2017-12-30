(function () {
  'use strict';

  angular
    .module('reports.admin')
    .controller('ReportsAdminListController', ReportsAdminListController);

  ReportsAdminListController.$inject = ['ReportsService'];

  function ReportsAdminListController(ReportsService) {
    var vm = this;

    vm.reports = ReportsService.query();
  }
}());
