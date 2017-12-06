'use strict';

// Create the 'chat' controller
angular.module('oil-details').controller('OilDetailsController', ['$scope', '$stateParams', 'Report', '$uibModal', '$location', 'Authentication', 'Socket',
  function ($scope, $stateParams, Report, $uibModal, $location, Authentication, Socket) {
    $scope.oil = $stateParams.oil;
    $scope.reports = [];

    $scope.propertyName = 'age';
    $scope.reverse = true;
    // $scope.friends = friends;

    $scope.sortBy = function(propertyName) {
      $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
      $scope.propertyName = propertyName;
    };

    $scope.find = function () {
      $scope.reports = Report.query();
    };

    $scope.find();

    $scope.openEditOilModal = function () {
      $uibModal.open({
        templateUrl: 'modules/oil-details/client/views/edit-oil.client.view.html',
        controller: 'EditOilController'
      }).result.then(function (res) {
        $scope.find();
      });
    };

    $scope.getDate = function(d){
      let date = new Date(d);
      return date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear();
    };

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
