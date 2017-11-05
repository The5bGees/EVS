'use strict';

angular
  .module('list-view')
  .factory('Oil', Oil);

Oil.$inject = ['$resource'];

function Oil($resource) {
  return $resource('/api/report', {
    oilId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}
