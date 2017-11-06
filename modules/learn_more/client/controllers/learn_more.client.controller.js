'use strict';

// Create the 'chat' controller
angular.module('learn_more').controller('LearnMoreController', ['$scope', '$location', 'Authentication', 'Socket',
  function ($scope, $location, Authentication, Socket) {
    console.log('here');
    document.getElementById("testing").innerHTML = 5 + 6;
    $('#testing').innerHTML = "hello";
  }

]);
