'use strict';

// Create the 'chat' controller
angular.module('list_view').controller('AddNewOilController', ['$scope', 'Oil', 'Upload',
  function ($scope, Oil, Upload) {
    $scope.oil = new Oil();


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
    $scope.saveOil = function () {
      Promise.all([uploadIcon(), 1])
        .then(function (values) {
          var iconfile = values[0].data.file;
          //var pdffile = values[0].data.file;
          addNewOil(iconfile.path)
            .then(function(res){
              $scope.$close(res);
            }).catch(function(err){
             //TODO: print message to user
          });
        }).catch(function(err){
          //TODO: print message to user
          console.log(err);
      });
    };

    var uploadIcon = function () {
      return new Promise(function (resolve, reject) {
        var iconImage = $scope.oil.icon_image;
        Upload.upload({
          url: 'api/oil/upload/uploadIcon',
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

    var uploadPdf = function () {
      return new Promise(function (resolve, reject) {
        var pdf = $scope.oil.pdf;
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

    var addNewOil = function (iconUrl,pdfUrl) {

      var addOil = new Oil({
        title: $scope.oil.title,
        content: "testing testing testing",
        icon:iconUrl,
        pdfUrlSample:pdfUrl
      });

    return new Promise(function(resolve,reject) {
      addOil.$save(function (res) {
        resolve(res);
      }, function (err) {
        reject(err);
      });
    });
    };
  }
]);
