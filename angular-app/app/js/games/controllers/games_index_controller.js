(function() {
  'use strict';

  angular.module('Games').controller('GamesIndexController', ['$scope', 'UsersService', '$cookies', '$location',
    function($scope, UsersService, $cookies, $location) {
      if (!$cookies.UID) {
        $location.path('/login');
        return;
      }

      $scope.sessions = [];

      UsersService.getAvailableSessions(function(sessions) {
        if (sessions.error) {
          console.log(sessions.error);
        } else {
          $scope.sessions = sessions;
        }
      });
  }]);
})();
