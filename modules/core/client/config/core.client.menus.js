(function () {
  'use strict';

  angular
    .module('core')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenu('account', {
      roles: ['user']
    });

    menuService.addMenuItem('account', {
      title: '',
      state: 'settings',
      type: 'dropdown',
      roles: ['user']
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Settings',
      state: 'settings.general',
      roles: ['user']
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Edit Profile',
      state: 'settings.profile',
      roles: ['user']
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Update Payment Details',
      state: 'settings.payment',
      roles: ['user']
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Cancel Subscription',
      state: 'settings.cancel',
      roles: ['user']
    });
  }
}());
