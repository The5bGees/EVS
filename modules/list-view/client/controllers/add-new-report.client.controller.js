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
      Promise.all([ uploadSimplifyPdf(), uploadExtendedPdf()])
        .then((res) => {
          let simplifyPdfUrl = res[0].data.file.path;
          let extendedPdfUrl = res[1].data.file.path;

          addNewreport(simplifyPdfUrl, extendedPdfUrl);
      });

    };

    let uploadSimplifyPdf = function () {
      let pdf = $scope.report.simplify_pdf;
      return new Promise(function (resolve, reject) {
        Upload.upload({
          url: 'api/report/upload/simplifyPdf',
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

    let uploadExtendedPdf = function () {
      let pdf = $scope.report.simplify_pdf;
      return new Promise(function (resolve, reject) {
        Upload.upload({
          url: 'api/report/upload/extendedPdf',
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
      console.log('here');

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
        },
        simplify_pdf : simplifyPdf,
        extended_pdf : extendedPdf
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
