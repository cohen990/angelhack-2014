(function() {
  'use strict';

  angular.module('Games').controller('GamesIndexController', ['$scope', 'UsersService',
    function($scope, UsersService) {
      $scope.sessions = null;

      UsersService.getAvailableSessions(function(sessions) {
        $scope.sessions = sessions;
      });
  }]);
})();
