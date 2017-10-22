'use strict';

// Create the 'chat' controller
angular.module('list_view').controller('ListViewController', ['$scope', '$location', 'Authentication', 'Oil', 'Upload',
  function ($scope, $location, Authentication, Oil, Upload) {
    $scope.authentication = Authentication;

    // Find a list of Oils
    $scope.find = function () {
      $scope.oils = Oil.query();
    };

    $scope.find();

    //TODO: remove it
    //var image = ["American Football", "Archery", "Athletics", "B", "Badminton", "Baseball", "Basketball", "Bowls", "Boxing", "C", "Canoeing", "Cricket", "Curling", "Cycling", "D", "Darts", "Disability Sport", "Diving", "E", "Equestrian", "F", "Fencing", "Football", "Formula 1", "G", "Gaelic Games", "Golf", "Gymnastics", "H", "Handball", "Hockey", "Horse Racing", "I", "Ice Hockey", "J", "Judo", "M", "Modern Pentathlon", "Motorsport", "N", "Netball", "O", "Olympic Sports", "R", "Rowing", "Rugby League", "Rugby Union", "S", "Sailing", "Shooting", "Snooker", "Squash", "Swimming", "T", "Table Tennis", "Taekwondo", "Tennis", "Triathlon", "V", "Volleyball", "W", "Weightlifting", "Winter Sports", "Wrestling"];
    $scope.uploadFile = function(files) {
      var fd = new FormData();
      //Take the first selected file
      fd.append("file", files[0]);

      $http.post('/api/oil', fd, {
        withCredentials: true,
        headers: {'Content-Type': undefined },
        transformRequest: angular.identity
      });
    };


    $scope.addNewOil = function (picFile) {
      console.log(picFile);
      Upload.upload({
        url:'/api/oil',
        data:{
          iconImage: picFile
        }
      }).then(function(res){
        console.log(res);
      });
    };

    $scope.showContent = function($fileContent){
      // console.log($fileContent);

      //TODO: upload file first and save it
      var addOil = new Oil({
        title: "SomeOil" + Math.floor(Math.random() * 10000),
        content: "testing testing testing",
        // icon: "http://lorempixel.com/400/200/sports/" + image[Math.floor(Math.random() * image.length)],
        uploads: {
          iconImage: $fileContent
        }
      });

      Upload.upload({
        url:'/api/oil',
        data: {
          file:$fileContent
        }
      }).then(function(res){
        console.log(res);
      });


      //
      // addOil.$save(function (res) {
      //   $scope.oils = Oil.query();
      // }, function (err) {
      //   $scope.error = err.data.message;
      // });

    }



    // $scope.showTabDialog = function(ev) {
    //   $mdDialog.show({
    //     controller: DialogController,
    //     templateUrl: '/modules/list_view/client/views/modal_add_oil.client.view.html',
    //     parent: angular.element(document.body),
    //     targetEvent: ev,
    //     clickOutsideToClose:true
    //   })
    //     //IF u want to show information use this
    //     .then(function(answer) {
    //       $scope.status = 'You said the information was "' + answer + '".';
    //     }, function() {
    //       $scope.status = 'You cancelled the dialog.';
    //     });
    // };
  }
]);


angular.module('list_view').directive('onReadFile', function ($parse) {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, element, attrs) {
      var fn = $parse(attrs.onReadFile);

      element.on('change', function(onChangeEvent) {
        var reader = new FileReader();

        reader.onload = function(onLoadEvent) {
          scope.$apply(function() {
            fn(scope, {$fileContent:onLoadEvent.target.result});
          });
        };

        reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
      });
    }
  };
});
