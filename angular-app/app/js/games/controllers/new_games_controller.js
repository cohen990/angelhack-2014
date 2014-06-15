(function() {
  'use strict';

  angular.module('Games').controller('NewGamesController', ['$scope', 'UsersService', '$location',
    function($scope, UsersService, $location) {
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
            $scope.$apply(function(scope) {
              $location.path('/game/' + id);
            });
          }
        });
      }
  }]);
})();
