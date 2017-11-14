(function () {
  'use strict';

  angular
    .module('users')
    .controller('EditProfileController', EditProfileController);

  EditProfileController.$inject = ['$scope', '$http', '$location', 'UsersService', 'Authentication', 'Notification'];

  function EditProfileController($scope, $http, $location, UsersService, Authentication, Notification) {
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
        image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
        locale: 'auto',
        token: function (token) {
          var obj = new Object();
          obj.token = token.id;
          obj.id = vm.user.stripeID;
          UsersService.updateCard(obj);
                      /*.then(function (response) {
                        Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Payment information successfully updated!'});
                      }, function (error) {
                        Notification.error({message: '<i class="glyphicon glyphicon-ok"></i> Payment information update failed!'});
                      });*/
        }
      });
      // Open Checkout with further options:
      handler.open({
        name: 'Test Widget',
        description: 'Test Description',
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
