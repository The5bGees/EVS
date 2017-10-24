'use strict';

// Create the 'chat' controller
angular.module('list_view').controller('ListViewController', ['$scope', '$location', 'Authentication', 'Oil', 'Upload',
  function ($scope, $location, Authentication, Oil, Upload) {
    $scope.authentication = Authentication;
    $scope.newOil = {};

    // Find a list of Oils
    $scope.find = function () {
      $scope.oils = Oil.query();
    };

    $scope.find();

    $scope.uploadIcon = function (iconImage) {
      Upload.upload({
        url: 'api/oil/upload/uploadIcon',
        data: {
          iconImage: iconImage
        }
      }).then(function (res) {
        $scope.newOil.icon = res.data.filename;
        console.log("icon image save");
      });
    };

    $scope.uploadPdf = function (pdf) {
      Upload.upload({
        url: 'api/oil/upload/pdf',
        data: {
          pdf: pdf
        }
      }).then(function (res) {
        $scope.newOil.pdf = res.data.filename;
        console.log("pdf image save");
      });
    };

    $scope.addNewOil = function () {

      //TODO: upload file first and save it
      var addOil = new Oil({
        title: "SomeOil" + Math.floor(Math.random() * 10000),
        content: "testing testing testing",

        extra: {
          icon: $scope.newOil.icon,
          pdf: $scope.newOil.pdf
        }
      });

      addOil.$save(function (res) {
        $scope.oils = Oil.query();
      }, function (err) {
        $scope.error = err.data.message;
      });
      $scope.newOil.icon = null;
    }
  }
]);
