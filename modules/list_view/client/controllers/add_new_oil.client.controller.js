'use strict';

// Create the 'chat' controller
angular.module('list_view').controller('AddNewOilController', ['$scope', 'Oil', 'Upload', '$http',
  function ($scope, Oil, Upload, $http) {
    $scope.oil = {};

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
      let pdfPath;

      uploadIcon()
        .then(function (res) {
          iconPath = res.data.file;
         // return uploadPdf();
          return addNewOil(iconPath.path, pdfPath.filename);
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
        url: '/api/oil/icon/',
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
          url: 'api/oil/upload/pdf',
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

    let addNewOil = function (iconUrl, pdfUrl) {

      let addOil = new Oil({
        title: $scope.oil.title,
        botanicalName: $scope.oil.botanicalName,
        reportNumber: $scope.oil.reportNumber,
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
  }
]);
