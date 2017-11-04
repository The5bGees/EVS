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
    let getFileName = function (res) {
      return res.data.file.path;
    };

    $scope.saveReport = function () {
      let iconPath;
      let pdfPath = {};

      uploadIcon()
        .then(function (res) {
          iconPath = res.data.file;
         // return uploadPdf();
          return addNewReport(iconPath.path, pdfPath.filename);
        })
        // .then(function (res) {
        //   pdfPath = res.data.file;
        //   return addNewReport(iconPath.path, pdfPath.filename);
        // })
        .then(function (res) {
          $scope.$close(res);
        })
        .catch(function (err) {
          if (iconPath) {
            deleteIcon(iconPath.path)
          }
          if (pdfPath) {
            //TODO: delete pdf
          }
          console.log(err);
        });
    };

    $scope.deleteIcon = function(){
      console.log("HERE");
      deleteIcon("i think its working");
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

    let addNewreport = function (iconUrl, pdfUrl) {

      let addReport = new Report({
        title: $scope.report.title,
        botanicalName: $scope.report.botanicalName,
        reportNumber: $scope.report.reportNumber,
        color: $scope.report.color,
        // content: "testing testing testing",
        icon: iconUrl,
        // pdfUrlSample: pdfUrl
      });

      return new Promise(function (resolve, reject) {
        addReport.$save(function (res) {
          resolve(res);
        }, function (err) {
          reject(err);
        });
      });
    };
  }
]);
