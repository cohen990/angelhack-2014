(function() {
  'use strict';

  angular.module('Games').controller('NewGamesController', ['$scope', 'UsersService', '$location', '$cookies',
    function($scope, UsersService, $location, $cookies) {
      if (!$cookies.UID) {
        $location.path('/login');
        return;
      }

      $scope.blackCards = [];

      $scope.onBlackCardsAdded = function(cards) {
        $scope.blackCards = cards;
      };

      UsersService.addObserver($scope);
      $scope.selectCard = function(blackCard) {
        var uid = UsersService.generateGUID();
        UsersService.startNewGame(blackCard, uid, function(data, status, header, config) {
          $location.path('/game/' + uid);
        });
      };
  }]);
})();
