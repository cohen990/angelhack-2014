(function() {
  'use strict';

  var Games = angular.module('Games', ['Users', 'ngRoute']);

  Games.controller('GamesController', ['$scope', '$routeParams', 'UsersService', '$http',
    function($scope, $routeParams, UsersService, $http) {
      $scope.game = null;

      $scope.onNotificationsUpdate = function(notifications) {
        if ($routeParams.gameId && UsersService.currentSessions) {
          var found = false;
          for (var i = 0; i < notifications.length; i++) {
            if (notifications[i].id_sbc === $routeParams.gameId) {
              $scope.game = {
                blackCard: notifications[i],
                mine: true,
                responses: null
              };
              UsersService.getResponsesFor(notifications[i].id_sbc,
                function(data, status, headers, config) {
                  $scope.game.responses = data;
              });
              found = true;
              break;
            }
          }

          if (!found) {
            $scope.game = {
              blackCard: null,
              mine: false,
              choices: null
            };
            UsersService.getRandomChoices(function(data, status, headers, config) {
              $scope.game.choices = data;
            });
          }
        }
      };

      UsersService.addNotificationObserver($scope);
  }]);

  Games.controller('GameNotificationsController', ['$scope', 'UsersService',
    function($scope, UsersService) {
      $scope.notifications = [];

      $scope.onNotificationsUpdate = function(notifications) {
        $scope.notifications = notifications;
      }

      UsersService.addNotificationObserver($scope);
  }]);

  Games.controller('NewGamesController', ['$scope', 'UsersService',
    function($scope, UsersService) {
      $scope.blackCards = [];

      $scope.onBlackCardsAdded = function(cards) {
        $scope.blackCards = cards;
      };

      UsersService.addObserver($scope);
      $scope.selectCard = function(id) {
        init(id, UsersService.sessionId, function(data) {
          if (data.error) {
            console.log('Failed to start new game session');
          } else {
            console.log('New Game Session Started');
          }
        });
      }
  }]);

  Games.controller('GamesIndexController', ['$scope', 'UsersService',
    function($scope, UsersService) {
      $scope.sessions = [];

      UsersService.getAvailableSessions(function(sessions) {
        $scope.sessions = sessions;
      });
  }]);
})();
