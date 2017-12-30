(function () {
  'use strict';

  angular
    .module('companies.admin')
    .controller('CompaniesAdminListController', CompaniesAdminListController);

  CompaniesAdminListController.$inject = ['CompaniesService'];

  function CompaniesAdminListController(CompaniesService) {
    var vm = this;

    vm.companies = CompaniesService.query();
  }
}());
