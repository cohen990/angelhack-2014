(function() {
  'use strict';

  var Users = angular.module('Users', []);

  Users.service('UsersService', [
    function() {
      this.username = '';
      this.cards = [
        { text: 'text 1', id: '1' },
        { text: 'text 2', id: '2' },
        { text: 'text 3', id: '3' }
      ];
  }]);

  Users.controller('UsersController', ['$scope', 'UsersService',
    function($scope, UsersService) {
      $scope.cards = UsersService.cards;
  }]);
})();
