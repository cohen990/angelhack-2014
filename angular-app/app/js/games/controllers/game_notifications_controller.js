(function() {
  'use strict';

  angular.module('Games').controller('GameNotificationsController', ['$scope', 'UsersService', '$cookies',
    function($scope, UsersService, $cookies) {
      $scope.notifications = [];

      $scope.onNotificationsUpdate = function(data) {
        $scope.notifications = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i].uid === $cookies.UID) {
            $scope.notifications.push(data[i]);
          }
        }
        if (!$scope.$$phase) {
          $scope.$digest();
        }
      }

      UsersService.addNotificationObserver($scope);
  }]);
})();
