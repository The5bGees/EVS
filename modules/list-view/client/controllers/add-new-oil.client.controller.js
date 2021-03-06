'use strict';

// Create the 'chat' controller
angular.module('list-view').controller('AddNewOilController', ['$scope', 'Oil', 'Upload', '$http',
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
      // let pdfPath = {};

      uploadIcon()
        .then(function (res) {
          iconPath = res.data.file;
          let path = null;
          if (iconPath) {
            path = iconPath.destination + iconPath.filename;
          }

          return addNewOil(path);
        })
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
  }
]);
