'use strict';

// Configuring the upload module
angular.module('upload').run(['menuService',
    function (Menus) {
        // Add the articles dropdown item
        Menus.addMenuItem('topbar', {
            title: 'Upload',
            state: 'upload',
            roles: ['admin'] 
        });
    }
]);
