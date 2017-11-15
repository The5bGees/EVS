'use strict';

// Create the 'chat' controller
angular.module('oil-details').controller('OilDetailsController', ['$scope', '$stateParams', 'Report', '$location', 'Authentication', 'Socket',
  function ($scope, $stateParams, Report, $location, Authentication, Socket) {
    $scope.oil = $stateParams.oil;
    $scope.reports = [];

    $scope.find = function () {
      $scope.reports = Report.query();
      console.log($scope.reports);
    };

    $scope.find();
  }

]);
