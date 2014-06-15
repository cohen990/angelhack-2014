(function() {
  'use strict';
  var Games = angular.module('Games');

  Games.controller('GamesController', ['$scope', '$routeParams', 'UsersService', '$http', '$cookies',
    function($scope, $routeParams, UsersService, $http, $cookies) {
      $scope.game = null;

      $scope.submitResponse = function(whiteCard) {
        UsersService.submitResponseFor($scope.game.blackCard, whiteCard);
      };

      $scope.onNotificationsUpdate = function(cards) {
        UsersService.getBlackCard($routeParams.gameUID, function(data) {
          $scope.game = {
            blackCard: data,
            mine: (data.uid === $cookies.UID)
          }

          $scope.game.myResponse = null;
          for (var i = 0; i < data.responses.length; i++) {
            if (data.responses[i].uid === $cookies.UID) {
              $scope.game.myResponse = data.responses[i];
              break;
            }
          }

          if ($scope.game.mine !== true && !$scope.game.myResponse) {
            UsersService.getRandomChoices(function(data, status, headers, config) {
              $scope.game.choices = data;
            });
          }

          if(!$scope.$$phase) {
            $scope.$digest();
          }
        });
      };

      UsersService.addNotificationObserver($scope);
  }]);
})();
