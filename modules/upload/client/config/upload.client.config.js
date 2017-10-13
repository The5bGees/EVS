'use strict';

// Configuring the Articles module
angular.module('upload').run(['Menus',
    function (Menus) {
        // Add the articles dropdown item
        Menus.addMenuItem('topbar', {
            title: 'Upload',
            state: 'upload',
            roles: ['user']  //everyone can see it
        });
    }
]);
