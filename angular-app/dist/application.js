(function() {
  'use strict';

  window.App = angular.module('App', ['Users', 'mobile-angular-ui']);
})();

(function() {
  'use strict';

  var Users = angular.module('Users', []);

  Users.service('UsersService', [
    function() {
      this.username = '';
      this.cards = Get3BlackCards();
  }]);

  Users.controller('UsersController', ['$scope', 'UsersService',
    function($scope, UsersService) {
      $scope.cards = UsersService.cards;

      $scope.selectCard = function(id) {
        init(id, 'user');
      }
  }]);
})();
