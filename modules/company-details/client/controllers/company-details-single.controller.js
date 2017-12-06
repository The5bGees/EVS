'use strict';

angular.module('company-details').controller('CompanyDetailsSingleController', ['$scope', 'Oil', 'A', 'Upload', '$http', '$sce',
  function ($scope, Oil, A, Upload, $http,$sce) {
    $scope.oil = {};
    $scope.report = A;
    let date = new Date($scope.report.date_tested);
    $scope.date= date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear();
    $scope.simplify_pdf = null;
    $scope.extended_pdf = null;

    $scope.getColor = function(result){
      if(result === 'Pass'){
        return 'green';
      }
      return 'red';
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
    let getFileName = function (res) {
      return res.data.file.path;
    };

    $scope.saveOil = function () {
      let iconPath;
      // let pdfPath = {};

      uploadIcon()
        .then(function (res) {
          iconPath = res.data.file;
          // return uploadPdf();
          return addNewOil(iconPath.destination + iconPath.filename);
        })
        // .then(function (res) {
        //   pdfPath = res.data.file;
        //   return addNewOil(iconPath.path, pdfPath.filename);
        // })
        .then(function (res) {
          $scope.$close(res);
        })
        .catch(function (err) {
          if (iconPath) {
            deleteIcon(iconPath.destination + iconPath.filename);
          }
          console.log(err);
        });
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
        let iconImage = $scope.oil.icon_image;
        Upload.upload({
          url: '/api/oil/icon',
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
        let pdf = $scope.oil.pdf;
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

    let addNewOil = function (iconUrl) {

      let addOil = new Oil({
        name: $scope.oil.name,
        botanical_name: $scope.oil.botanical_name,
        description: $scope.oil.description,
        color: $scope.oil.color,
        // content: "testing testing testing",
        icon: iconUrl,
        // pdfUrlSample: pdfUrl
      });

      return new Promise(function (resolve, reject) {
        addOil.$save(function (res) {
          resolve(res);
        }, function (err) {
          reject(err);
        });
      });
    };

    //Read pdf files
    let getSimplifyPdf = function () {
      if($scope.report.simplify_pdf==='NA'){
        return;
      }

      $http({
        method: 'GET',
        url: '/api/report/pdf',
        responseType: 'arraybuffer',
        params: {
          pdfUrl: $scope.report.simplify_pdf
        }
      })
        .success(function (data) {
          let file = new Blob([data], {type: 'application/pdf'});
          let fileURL = URL.createObjectURL(file);
          $scope.simplify_pdf = $sce.trustAsResourceUrl(fileURL);
        });
    };
    getSimplifyPdf();
  }
]);
