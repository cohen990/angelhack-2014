(function() {
  'use strict';
  var Games = angular.module('Games');

  Games.controller('GamesController', ['$scope', '$routeParams', 'UsersService', '$http', '$cookies',
    function($scope, $routeParams, UsersService, $http, $cookies) {
      $scope.game = null;

      $scope.submitResponse = function(whiteCardId) {
        UsersService.submitResponseFor($scope.game.blackCard, whiteCardId, function() {
          console.log('Success!');
        });
      };

      $scope.onNotificationsUpdate = function(notifications) {
        console.log('updated');
        if ($routeParams.gameUID && UsersService.currentSessions) {
          var found = false;
          for (var i = 0; i < notifications.length; i++) {
            if (notifications[i].id_sbc === $routeParams.gameUID) {
              $scope.game = {
                blackCard: notifications[i],
                mine: true,
                responses: null
              };
              console.log('found');
              console.log(notifications[i]);
              UsersService.getResponsesFor(notifications[i].id_sbc,
                function(data, status, headers, config) {
                  $scope.game.responses = data;
              });
              found = true;
              break;
            }
          }

          if (!found) {
            console.log('not found');
            $scope.game = {
              blackCard: null,
              mine: false,
              choices: null
            };
            UsersService.getBlackCard($routeParams.gameUID, function(data) {
              $scope.game = {
                blackCard: data[0],
                mine: (data[0].fk_uid === $cookies.UID),
                choices: null
              }
            });
            UsersService.getRandomChoices(function(data, status, headers, config) {
              $scope.game = {
                blackCard: $scope.game.blackCard,
                mine: (data[0].fk_uid === $cookies.UID),
                choices: data
              }
            });
          }
        }
      };

      UsersService.addNotificationObserver($scope);
  }]);
})();
