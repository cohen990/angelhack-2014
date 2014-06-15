(function() {
  'use strict';

  angular.module('Games').controller('NewGamesController', ['$scope', 'UsersService', '$location', '$cookies',
    function($scope, UsersService, $location, $cookies) {
      if (!$cookies.UID) {
        $location.path('/login');
        return;
      }

      $scope.blackCards = null;
      UsersService.getNewBlackCards(function(data) {
        $scope.blackCards = data;

        if (!$scope.$$phase) $scope.$digest();
      });

      $scope.selectCard = function(blackCard) {
        UsersService.getNewBlackCards(function(data) {
          $scope.blackCards = data;
        });

        var uid = UsersService.generateGUID();
        UsersService.startNewGame(blackCard, uid);
        $location.path('/game/' + uid);

        if (!$scope.$$phase) $scope.$digest();
      };
  }]);
})();
