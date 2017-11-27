'use strict';

// Create the 'chat' controller
angular.module('list-view').controller('AddNewReportController', ['$scope', 'Report', 'Upload', '$http',
  function ($scope, Report, Upload, $http) {
    $scope.report = {};

    /**
     * FILE EXAMPLE:
     * file: {
       destination: "./modules/list_view/server/temp_folder/",
       encoding: "7bit"
       fieldname: "iconImage"
       filename: "1a4b53f658846ba9655fb189c3f6d023"
       mimetype: "image/png"
       originalname : "name.png"
       path: "modules\list_view\server\temp_folder\1a4b53f658846ba9655fb189c3f6d023"
       size: 9713
     }
     */
    $scope.saveReport = function () {
      addNewreport();
    };

    let deleteIcon = (fileName) => {
      $http({
        method: 'DELETE',
        url: '/api/report/icon/',
        params: {
          path: fileName
        }
      })
        .then((res) => {
          console.log(res);
        }).catch((err) => {
        console.log(err);
      });
    };

    let uploadIcon = function () {
      return new Promise(function (resolve, reject) {
        let iconImage = $scope.report.icon_image;
        Upload.upload({
          url: '/api/report/icon',
          data: {
            iconImage: iconImage
          }
        }).then(function (res) {
          resolve(res);
        }).catch(function (err) {
          reject(err)
        });
      });
    };

    let uploadPdf = function () {
      return new Promise(function (resolve, reject) {
        let pdf = $scope.report.pdf;
        Upload.upload({
          url: 'api/report/upload/pdf',
          data: {
            pdf: pdf
          }
        }).then(function (res) {
          resolve(res);
        }).catch(function (err) {
          reject(err)
        });
      });
    };

    let addNewreport = function (simplifyPdf, extendedPdf) {

      let resultChecked = "Fail";
      if(document.getElementById("resultCheckBox").checked){
        resultChecked = "Pass";
      }

      let addReport = new Report({
        name: $scope.report.name,
        date_tested: $scope.report.date_tested,
        description: $scope.report.description,
        country_of_origin: $scope.report.country_of_origin,
        result: resultChecked,
        oil: {
          name:$scope.report.oil.name
        },
        company:{
          name: $scope.report.company.name
        }
        // simplify_pdf : simplifyPdf,
        // extended_pdf : extendedPdf
      });

      //TODO jorge: remove this
      console.log(addReport);

      return new Promise(function (resolve, reject) {
        addReport.$save(function (res) {
          resolve(res);
          $scope.$close();
        }, function (err) {
          reject(err);
        });
      });
    };
  }
]);
