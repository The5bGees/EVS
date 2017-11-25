'use strict';

// Create the 'chat' controller
angular.module('company-details').controller('CompanyDetailsController', ['$scope', '$stateParams', 'Report', '$uibModal', '$location', 'Authentication', 'Socket',
  function ($scope, $stateParams, Report, $uibModal, $location, Authentication, Socket) {
    $scope.company = $stateParams.company;
    $scope.reports = [];

    $scope.find = function () {
      $scope.reports = Report.query();
    };

    $scope.find();

    $scope.openSingleOilModal = function (report) {
      $uibModal.open({
        templateUrl: 'modules/oil-details/client/views/oil-details-single.view.html',
        controller: 'OilDetailsSingleController',
        resolve: {
          A: function() {
            return report
          }
        }
      }).result.then(function (res) {
        $scope.find();
      });
    };
  }

]);
