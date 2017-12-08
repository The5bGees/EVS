'use strict';

// Create the 'chat' controller
angular.module('list-view').controller('AddNewCompanyController', ['$scope', 'Company', 'Upload', '$http',
  function ($scope, Company, Upload, $http) {
    $scope.company = {};

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

    $scope.saveCompany = function () {
      let iconPath;
      // let pdfPath = {};

      uploadIcon()
        .then(function (res) {
          iconPath = res.data.file;
          let path = null;
          if (iconPath) {
            path = iconPath.destination + iconPath.filename;
          }

          return addNewCompany(path);
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
        let iconImage = $scope.company.icon_image;
        Upload.upload({
          url: '/api/company/icon',
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

    let addNewCompany = function (iconUrl) {

      //TODO: need to be modify, depending on module
      let addCompany = new Company({
        name: $scope.company.name,
        description: $scope.company.description,
        website: $scope.company.website,
        color: $scope.company.color,
        icon: iconUrl,
      });

      return new Promise(function (resolve, reject) {
        addCompany.$save(function (res) {
          resolve(res);
        }, function (err) {
          reject(err);
        });
      });
    };
  }
]);
