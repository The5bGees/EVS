'use strict';

angular
  .module('list-view')
  .factory('report', Report);

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
