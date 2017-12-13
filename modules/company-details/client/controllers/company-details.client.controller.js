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

    $scope.propertyName = 'name';
    $scope.reverse = true;
    //$scope.friends = friends;

    $scope.sortBy = function(propertyName) {
      $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
      $scope.propertyName = propertyName;
    };



    $scope.getDate = function(d){
      let date = new Date(d);
      return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();
    };

    $scope.openSingleCompanyModal = function (report) {
      $uibModal.open({
        templateUrl: 'modules/company-details/client/views/company-details-single.view.html',
        controller: 'CompanyDetailsSingleController',
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
