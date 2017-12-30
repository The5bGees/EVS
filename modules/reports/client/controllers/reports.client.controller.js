(function () {
  'use strict';

  angular
    .module('reports')
    .controller('ReportsController', ReportsController);

  ReportsController.$inject = ['$scope', 'reportResolve', 'Authentication'];

  function ReportsController($scope, report, Authentication) {
    var vm = this;

    vm.report = report;
    vm.authentication = Authentication;

  }
}());
