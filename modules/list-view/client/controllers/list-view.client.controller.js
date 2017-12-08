'use strict';

// Create the 'chat' controller
angular.module('list-view').controller('ListViewController', ['$scope', '$state', '$location', 'Authentication', 'Oil','Company' ,'Upload', '$uibModal',
  function ($scope, $state, $location, Authentication, Oil, Company ,Upload, $uibModal) {
    $scope.authentication = Authentication;
    $scope.oils = [];
    $scope.searchTerm = '';
    $scope.sortType = 'title';
    $scope.searchKeys = [];


    $scope.find = function () {

      $scope.oils = Oil.query();
      $scope.companies = Company.query();
    };

    $scope.find();

    $scope.getColor = function (color) {
      if (!color) {
        return 'purple';
      }
      return color[0] || 'purple';
    };

    $scope.openOilDetails = function (oil) {
      $state.go('oil-details', {oil: oil});
    };

    $scope.openCompanyDetails = function (company) {
      $state.go('company-details', {company: company});
    };


    $scope.getOilIcon = function(oil){
      if(!oil || !oil.icon){
        return {
          'background-image':'url("modules/list-view/client/img/default-images/oil.png")',
          'background-position': 'center 45%',
          'background-size': 'auto 60%'
        }
      }
      return {
        'background-image':'url(' + oil.icon.replace(/\\/g,'/') + ')',
        'background-position': 'center 45%',
        'background-size': 'auto 60%'
      }
    };

    $scope.getCompanyIcon = function(company){
      if(!company || !company.icon){
        return {
          'background-image':'url("modules/list-view/client/img/default-images/company.png")',
          'background-position': 'center 45%',
          'background-size': 'auto 60%'
        }
      }
      return {
        'background-image':'url(' + company.icon.replace(/\\/g,'/') + ')',
        'background-position': 'center 45%',
        'background-size': 'auto 60%'
      }
    };

  }
]).directive('oilCard', function () {
  return {
    restrict: 'E',
    templateUrl: 'modules/list-view/client/views/list-view-directives/oil-card.client.view.html'
  };
}).directive('companyCard', function () {
  return {
    restrict: 'E',
    templateUrl: 'modules/list-view/client/views/list-view-directives/company-card.client.view.html'
  };
}).directive('searchBar', function () {
  return {
    restrict: 'E',
    templateUrl: 'modules/list-view/client/views/list-view-directives/search-bar.client.view.html'
  };
}).directive('reportList', function () {
  return {
    restrict: 'E',
    templateUrl: 'modules/list-view/client/views/list-view-directives/report-list.client.view.html'
  };
});
