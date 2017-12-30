(function () {
  'use strict';

  angular
    .module('oils')
    .controller('OilsController', OilsController);

  OilsController.$inject = ['$scope', 'oilResolve', 'ReportsService', 'Authentication'];

  function OilsController($scope, oil, ReportsService, Authentication) {
    var vm = this;

    vm.oil = oil;
    vm.authentication = Authentication;
    vm.reports = ReportsService.query();

  }
}());
