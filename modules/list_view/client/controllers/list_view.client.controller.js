'use strict';

// Create the 'chat' controller
angular.module('list_view').controller('ListViewController', ['$scope', '$location', 'Authentication', 'Oil', 'Upload', '$uibModal',
  function ($scope, $location, Authentication, Oil, Upload, $uibModal) {
    $scope.authentication = Authentication;
    $scope.newOil = {};

    // Find a list of Oils
    $scope.find = function () {
      // $scope.oils = Oil.query();
      Oil.query((res)=>{
        console.log(res)
      });
      // console.log(Object.keys($scope.oils[0]));
    };

    $scope.find();

    $scope.openModal = function () {
      $uibModal.open({
        templateUrl: "modules/list_view/client/views/add_new_oil.client.view.html",
        controller: "AddNewOilController"
      }).result.then(function(res){
        $scope.find();
      });
    };
  }
])
;
