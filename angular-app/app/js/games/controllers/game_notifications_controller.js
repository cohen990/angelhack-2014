(function() {
  'use strict';

  angular.module('Games').controller('GameNotificationsController', ['$scope', 'UsersService',
    function($scope, UsersService) {
      $scope.notifications = [];

      $scope.onNotificationsUpdate = function(notifications) {
        $scope.notifications = notifications;
      }

      UsersService.addNotificationObserver($scope);
  }]);
})();
