(function () {
  'use strict';

  angular
    .module('reports.admin')
    .controller('ReportsAdminListController', ReportsAdminListController);

  ReportsAdminListController.$inject = ['$scope', 'ReportsService'];

  function ReportsAdminListController($scope, ReportsService) {
    var vm = this;

    vm.reports = ReportsService.query();

    $scope.propertyName = 'date';
    $scope.reverse = true;

    $scope.sortBy = function (propertyName) {
      $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
      $scope.propertyName = propertyName;
    };
  }
}());
