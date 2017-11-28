'use strict';

angular
  .module('list-view')
  .factory('Company', Company);

Company.$inject = ['$resource'];

function Company($resource) {
  return $resource('/api/company', {
    oilId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}
