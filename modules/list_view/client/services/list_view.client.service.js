'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('list_view').factory('Oil', ['$resource',
    function ($resource) {
        return $resource('api/oil/:oilId', {
            oilId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
