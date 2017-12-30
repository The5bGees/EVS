(function () {
  'use strict';

  angular
    .module('reports.services')
    .factory('ReportsService', ReportsService);

  ReportsService.$inject = ['$resource', '$log'];

  function ReportsService($resource, $log) {
    var Report = $resource('/api/reports/:reportId', {
      reportId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Report.prototype, {
      createOrUpdate: function () {
        var report = this;
        return createOrUpdate(report);
      }
    });

    return Report;

    function createOrUpdate(report) {
      if (report._id) {
        return report.$update(onSuccess, onError);
      } else {
        return report.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(report) {
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
