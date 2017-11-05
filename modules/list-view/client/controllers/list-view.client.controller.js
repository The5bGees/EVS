'use strict';

// Create the 'chat' controller
angular.module('list-view').controller('ListViewController', ['$scope', '$location', 'Authentication', 'Oil', 'Upload', '$uibModal',
  function ($scope, $location, Authentication, Oil, Upload, $uibModal) {
    $scope.authentication = Authentication;
    $scope.newOil = {};
    $scope.oils;
    $scope.searchTerm = '';
    $scope.sortType = 'title';
    $scope.searchKeys = [];
    // Find a list of Oils

    $scope.find = function () {
      Oil.query(function(res){
        $scope.oils = res;
        $scope.searchKeys = Object.keys($scope.oils[0]);
        // $scope.searchKeys = $scope.searchKeys.slice(5);

      });
    };

    $scope.find();

    $scope.getColor = function(color){
      if(!color[0]){
        return "purple"
      }
      return color[0];
    };

    $scope.openOilModal = function () {
      $uibModal.open({
        templateUrl: "modules/list-view/client/views/add-new-report.client.view.html",
        controller: "AddNewOilController"
      }).result.then(function(res){
        $scope.find();
      });
    };

    $scope.openReportModal = function(){
      $uibModal.open({
        templateUrl: "modules/list-view/client/controllers/add-new-report.client.controller.js",
        controller: "AddNewReportController"
      }).result.then(function(res){
        $scope.find();
      });
    }
  }
]).directive('oilCard', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/list-view/client/views/list-view-directives/oil-card.client.view.html'
  };
}).directive('searchBar', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/list-view/client/views/list-view-directives/search-bar.client.view.html'
  };
}).directive('reportList', function(){
  return {
    restrict : 'E',
    templateUrl : 'modules/list-view/client/views/report-list.client.view.html'
  };
}).filter('regex', function() {
  return function(input, field, scope) {
    if(input === undefined){
      return 0
    }

    if(scope.searchTerm !== ''){
      var reg = scope.searchTerm.toLowerCase() + "+";
    }else{
      var reg = ".+";
    }
    var patt = new RegExp(reg);
    var out = [];
    for (var i = 0; i < input.length; i++){
      for (var j = 0; j < field.length; j++) {
        if (patt.test(input[i][field[j]].toLowerCase()))
          out.push(input[i]);
      }
    }
    return out;
  };
});

