'use strict';

// Configure the 'chat' module routes
angular.module('upload').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('upload', {
                url: '/upload',
                templateUrl: 'modules/upload/client/views/upload.client.view.html'
            });
    }
]);
