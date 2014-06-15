(function() {
  'use strict';

  angular.module('Games').controller('GamesIndexController', ['$scope', 'UsersService',
    function($scope, UsersService) {
      $scope.sessions = [];

      UsersService.getAvailableSessions(function(sessions) {
        $scope.sessions = sessions;
      });
  }]);
})();
