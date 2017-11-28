'use strict';

angular
  .module('oil-details')
  .factory('Report', Report);

Report.$inject = ['$resource'];

function Report($resource) {
  return $resource('/api/report', {
    oilId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}
