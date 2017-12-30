(function () {
  'use strict';

  angular
    .module('oils.services')
    .factory('OilsService', OilsService);

  OilsService.$inject = ['$resource', '$log'];

  function OilsService($resource, $log) {
    var Oil = $resource('/api/oils/:oilId', {
      oilId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Oil.prototype, {
      createOrUpdate: function () {
        var oil = this;
        return createOrUpdate(oil);
      }
    });

    return Oil;

    function createOrUpdate(oil) {
      if (oil._id) {
        return oil.$update(onSuccess, onError);
      } else {
        return oil.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(oil) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
