'use strict';

angular
  .module('list-view')
  .factory('Oil', Oil);

Oil.$inject = ['$resource'];

function Oil($resource) {
  return $resource('/api/oil', {
    oilId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}
