(function() {
  'use strict';

  angular.module('Games').controller('NewGamesController', ['$scope', 'UsersService',
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
})();
