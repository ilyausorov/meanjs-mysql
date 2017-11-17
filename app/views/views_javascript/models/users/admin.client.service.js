(function () {
  'use strict';

  angular.module('users.admin.services').factory('AdminService', AdminService);

  AdminService.$inject = ['$resource'];

  function AdminService($resource) {
    return $resource('/api/users/:userId', {
      userId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
