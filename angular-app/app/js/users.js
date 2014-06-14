(function() {
  'use strict';

  var Users = angular.module('Users', []);

  Users.service('UsersService', [
    function() {
      var self = this;
      self.observers = [];

      self.addObserver = function(observer) {
        if (self.observers.indexOf(observer) === -1) {
          self.observers.push(observer);
        }
      };

      Get3BlackCards(function(data) {
        for (var i = 0; i < self.observers.length; i++) {
          self.observers[i].$apply(function(scope) {
            scope.cards = data;
          });
        }
      });
  }]);

  Users.controller('UsersController', ['$scope', 'UsersService',
    function($scope, UsersService) {
      $scope.cards = [];
      UsersService.addObserver($scope);
      $scope.selectCard = function(id) {
        init(id, 'user');
      }
  }]);
})();
