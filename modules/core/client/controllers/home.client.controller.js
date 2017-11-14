/**
 * Created by Jorge-laptop3 on 11/6/2017.
 */

(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$state', 'Authentication', 'menuService'];

  function HomeController($scope, $state, Authentication, menuService) {
    var vm = this;

  }
}());
