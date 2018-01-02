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

        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Edit profile successful!' });
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
        key: 'pk_live_dxEqRBddIOgISC548HyNxceH',
        image: '/modules/core/client/img/brand/logo-certified.png',
        locale: 'auto',
        token: function (token) {
          var obj = {};
          obj.token = token.id;
          obj.id = vm.user.stripeID;
          UsersService.updateCard(obj)
                      .then(onUpdateSuccess)
                      .catch(onUpdateError);
        }
      });
      // Open Checkout with further options:
      handler.open({
        name: 'EVS',
        description: 'Monthly subscription',
        panelLabel: 'Update Card Details',
        allowRememberMe: 'false',
        email: vm.user.email
      });
      e.preventDefault();
    };

    function onUpdateSuccess(response) {
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Payment details updated. Please check your email for confirmation.' });
    }

    function onUpdateError(response) {
      Notification.error({
        title: '<i class="glyphicon glyphicon-remove"></i> Failed to update payment details. Please try again in a few minutes or contact us.',
        delay: 6000
      });
    }

    $scope.cancelSubscription = function (e) {
      UsersService.cancel(vm.user)
                  .then(onCancelSuccess)
                  .catch(onCancelError);
    };

    function onCancelSuccess(response) {
      Notification.success({
        message: '<i class="glyphicon glyphicon-ok"></i> Subscription canceled. Please check your email for confirmation.',
        delay: 10000
      });
    }

    function onCancelError(response) {
      Notification.error({
        title: '<i class="glyphicon glyphicon-remove"></i> Failed to cancel subscription. Please try again in a few minutes or contact us.',
        delay: 10000
      });
    }
  }
}());
