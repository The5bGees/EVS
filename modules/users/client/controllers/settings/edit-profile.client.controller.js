(function () {
  'use strict';

  angular
    .module('users')
    .controller('EditProfileController', EditProfileController);

  EditProfileController.$inject = ['$scope', '$http', '$location', '$window', 'UsersService', 'Authentication', 'Notification'];

  function EditProfileController($scope, $http, $location, $window, UsersService, Authentication, Notification) {
    var vm = this;

    vm.user = Authentication.user;
    vm.updateUserProfile = updateUserProfile;

    // Update a user profile
    function updateUserProfile(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = new UsersService(vm.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'vm.userForm');

        Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Edit profile successful!'});
        Authentication.user = response;
      }, function (response) {
        Notification.error({
          message: response.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Edit profile failed!'
        });
      });
    }

    $scope.updatePayment = function (e) {
      var handler = $window.StripeCheckout.configure({
        key: 'pk_test_2V8cJyxlQYaXSfb6dixNcZPJ',
        image: '/modules/core/client/img/brand/logo.png',
        locale: 'auto',
        token: function (token) {
          var obj = new Object();
          obj.token = token.id;
          obj.id = vm.user.stripeID;
          UsersService.updateCard(obj);
        }
      });
      // Open Checkout with further options:
      handler.open({
        name: 'Essential Validation Services',
        description: 'This is a monthly subscription to our database of essential oil purity assessment reports. As the only indepenent, third-party essential oil testing laboratory, you will be getting access to the best information about essential oil quality available today.',
        panelLabel: 'Update Card Details',
        allowRememberMe: 'false',
        email: vm.user.email
      });
      e.preventDefault();
    };

    $scope.cancelSubscription = function (e) {
      UsersService.cancel(vm.user);
                  /*.then(function (response) {
                    Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Payment information successfully updated!'});
                  }, function (error) {
                    Notification.error({message: '<i class="glyphicon glyphicon-ok"></i> Payment information update failed!'});
                  });*/
    };
  }
}());
