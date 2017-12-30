(function () {
  'use strict';

  angular
    .module('oils.admin')
    .controller('OilsAdminListController', OilsAdminListController);

  OilsAdminListController.$inject = ['OilsService'];

  function OilsAdminListController(OilsService) {
    var vm = this;

    vm.oils = OilsService.query();
  }
}());
