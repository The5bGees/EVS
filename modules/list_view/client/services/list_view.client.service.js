'use strict';

angular
  .module('list_view')
  .factory('Oil', Oil);

Oil.$inject = ['$resource'];

function Oil($resource) {
  let oil = $resource('/api/oil', {}, {
    update: {
      method: 'PUT'
    }
  }, {
    deleteIcon: {
      method: 'DELETE',
      url: '/api/oil/icon'
    }
  });

  angular.extend(oil, {
    requestDeleteIcon: function (iconPath) {
      return oil.$deleteIcon().$promise;
    }
  });

  return oil;
}

// //Articles service used for communicating with the oil REST endpoints
// angular.module('list_view').factory('Oil', ['$resource',
//   function ($resource) {
//     let Users = $resource('/api/oil',{},{
//       update:{
//         method:'PUT'
//       }
//     },{
//       deleteIcon:{
//         method:'DELETE',
//         url: '/api/oil/delete/icon'
//       }
//     });
//     // return $resource('api/oil/:oilId', {
//     //   oilId: '@_id'
//     // }, {
//     //   update: {
//     //     method: 'PUT'
//     //   }
//     // });
//
//     angular.extend(Users,{
//       requestDeleteIcon : function(iconPath){
//         return this.deleteIcon(iconPath).$promise;
//       }
//     });
//
//     return Users;
//   }
// ]);

