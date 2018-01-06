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
    $scope.propertyName = 'date';
    $scope.reverse = true;

    $scope.sortBy = function (propertyName) {
      $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
      $scope.propertyName = propertyName;
    };

    $scope.getDate = function (date) {
      var d = new Date(date);

      var month = d.getMonth() + 1;
      var mon;
      if (month < 10) {
        mon = '0' + month.toString();
      } else {
        mon = month.toString();
      }

      var day;
      if (d.getDate() < 10) {
        day = '0' + d.getDate().toString();
      } else {
        day = d.getDate().toString();
      }

      return mon + '/' + day + '/' + d.getFullYear();
    };

  }
}());
