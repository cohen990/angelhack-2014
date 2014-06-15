(function() {
  'use strict';

  angular.module('Games').controller('GamesController', ['$scope', '$routeParams', 'UsersService', '$http',
    function($scope, $routeParams, UsersService, $http) {
      $scope.game = null;

      $scope.submitResponse = function(whiteCardId) {
        UsersService.submitResponseFor($scope.game.blackCardId, whiteCardId, function() {
          console.log('Success!');
        });
      };

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
})();
