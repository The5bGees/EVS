(function () {
  'use strict';

  angular
    .module('companies.admin')
    .controller('CompaniesAdminController', CompaniesAdminController);

  CompaniesAdminController.$inject = ['$scope', '$state', '$window', 'companyResolve', 'Authentication', 'Upload', 'Notification'];

  function CompaniesAdminController($scope, $state, $window, company, Authentication, Upload, Notification) {
    var vm = this;

    vm.company = company;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.user = Authentication.user;

    // Remove existing Company
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.company.$remove(function () {
          $state.go('admin.companies.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Company deleted successfully!' });
        });
      }
    }

    // Save Company
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.companyForm');
        return false;
      }

      if (vm.company.icon_image) {
        Upload.upload({
          url: '/api/companies/icon',
          data: {
            icon: vm.company.icon_image
          }
        }).then(function (res) {
          var iconPath = res.data.url;
          if (iconPath) {
            vm.company.icon = iconPath;
          } else {
            vm.company.icon = null;
          }
          vm.company.createOrUpdate()
            .then(successCallback)
            .catch(errorCallback);
        }).catch(function (err) {
          Notification.error({
            message: err.toString(),
            title: '<i class="glyphicon glyphicon-remove"></i> Photo upload error!'
          });
        });
      } else {
        vm.company.createOrUpdate()
          .then(successCallback)
          .catch(errorCallback);
      }

      function successCallback(res) {
        $state.go('admin.companies.list');
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Company saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({
          message: res.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Company save error!'
        });
      }
    }
  }
}());
