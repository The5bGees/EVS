(function () {
  'use strict';

  angular
    .module('oils')
    .controller('OilsListController', OilsListController);

  OilsListController.$inject = ['OilsService'];

  function OilsListController(OilsService) {
    var vm = this;

    vm.oils = OilsService.query();
  }
}());
