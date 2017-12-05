'use strict';

// Create the 'chat' controller
angular.module('list-view').controller('AddNewReportController', ['$scope', 'Report', 'Upload', 'Oil', 'Company', '$http',
  function ($scope, Report, Upload, Oil, Company, $http) {
    let oil_name = 'Oil Name';
    let company_name = 'Company Name';
    $scope.error_message = "";
    $scope.pdf_name = "";
    $scope.report = {
      oil: {
        name: oil_name
      },
      company: {
        name: company_name
      }
    };
    $scope.oils = [];
  $scope.companies = [];

    $scope.status = {
      isopen1: false,
      isopen2: false
    };

    $scope.find = function () {
      $scope.oils = Oil.query();
      $scope.companies = Company.query();
    };

    $scope.find();

    $scope.changeOilText = function (value) {
      // document.getElementById('oilNameText').innerHTML = value;
      console.log("HERE");
      $scope.report.oil.name = value;
    };

  $scope.changeCompanyText = function (value) {
    // document.getElementById('oilNameText').innerHTML = value;
    console.log("HERE");
    $scope.report.company.name = value;
  };

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
    let checkErrorExists = function(){

      if($scope.report.oil.name === oil_name || $scope.report.company.name === company_name ||
        $scope.report.date_tested === ""|| $scope.report.country_of_origin === "" ||
        $scope.report.simplify_pdf === undefined){
        $scope.error_message = "Please complete all required fields";

        return true;
      }
      return false;
    };

    $scope.saveReport = function () {

      if(checkErrorExists())
        return;


      uploadSimplifyPdf()
        .then((res) => {
          let simplifyPdfUrl = res.data.file.path;

          addNewreport(simplifyPdfUrl);
      })

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

    let addNewreport = function (simplifyPdf) {
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
        simplify_pdf : simplifyPdf
      });

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
