'use strict';

// Create the 'chat' controller
angular.module('list_view').controller('ListViewController', ['$scope', '$location', 'Authentication', 'Oil',
function ($scope, $location, Authentication, Oil) {
  $scope.authentication = Authentication;

  // Find a list of Oils
  $scope.find = function () {
    $scope.oils = Oil.query();
  };

  $scope.find();

  //TODO: remove it
  var image = ["American Football","Archery","Athletics","B","Badminton","Baseball","Basketball","Bowls","Boxing","C","Canoeing","Cricket","Curling","Cycling","D","Darts","Disability Sport","Diving","E","Equestrian","F","Fencing","Football","Formula 1","G","Gaelic Games","Golf","Gymnastics","H","Handball","Hockey","Horse Racing","I","Ice Hockey","J","Judo","M","Modern Pentathlon","Motorsport","N","Netball","O","Olympic Sports","R","Rowing","Rugby League","Rugby Union","S","Sailing","Shooting","Snooker","Squash","Swimming","T","Table Tennis","Taekwondo","Tennis","Triathlon","V","Volleyball","W","Weightlifting","Winter Sports","Wrestling"];

  $scope.addNewOil = function () {

    var addOil = new Oil({
      title: "SomeOil" + Math.floor(Math.random() * 10000),
      content: "testing testing testing",
      icon: "http://lorempixel.com/400/200/sports/" + image[Math.floor(Math.random()*image.length)]
    });

    addOil.$save(function (res) {

    }, function (err) {
      $scope.error = err.data.message;
    });
  };
}
]);
