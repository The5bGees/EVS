(function () {
  'use strict';

  angular
    .module('oils.admin')
    .controller('OilsAdminController', OilsAdminController);

  OilsAdminController.$inject = ['$scope', '$state', '$window', 'oilResolve', 'Authentication', 'Upload', 'Notification'];

  function OilsAdminController($scope, $state, $window, oil, Authentication, Upload, Notification) {
    var vm = this;

    vm.oil = oil;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.user = Authentication.user;

    // Remove existing Oil
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.oil.$remove(function () {
          $state.go('admin.oils.list');
          Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Oil deleted successfully!'});
        });
      }
    }

    // Save Oil
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.oilForm');
        return false;
      }

      if (vm.oil.icon_image) {
        Upload.upload({
          url: '/api/oils/icon',
          data: {
            icon: vm.oil.icon_image
          }
        }).then(function (res) {
          var iconPath = res.data.url;
          if (iconPath) {
            vm.oil.icon = iconPath;
          }
          else {
            vm.oil.icon = null;
          }
          vm.oil.createOrUpdate()
            .then(successCallback)
            .catch(errorCallback);
        }).catch(function (err) {
          Notification.error({
            message: res.data.message,
            title: '<i class="glyphicon glyphicon-remove"></i> Photo upload error!'
          });
        });
      }
      else {
        vm.oil.createOrUpdate()
          .then(successCallback)
          .catch(errorCallback);
      }

      function successCallback(res) {
        $state.go('admin.oils.list');
        Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Oil saved successfully!'});
      }

      function errorCallback(res) {
        Notification.error({
          message: res.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Oil save error!'
        });
      }
    }
  }
}());
