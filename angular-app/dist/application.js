(function() {
  'use strict';

  window.App = angular.module('App', ['Users', 'mobile-angular-ui', 'ngRoute']);

  window.App.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', { templateUrl: 'templates/search-games.html' });
    $routeProvider.when('/new-game', { templateUrl: 'templates/new-game.html' });
    $routeProvider.when('/stats', { templateUrl: 'templates/stats.html' });
  });
})();

(function() {
  'use strict';

  var Users = angular.module('Users', []);

  Users.service('UsersService', [
    function() {
      var self = this;
      self.observers = [];
      self.notificationsObserver = [];
      self.sessionId = self.sessionId || generateGUID();
      self.blackCards = null;
      self.currentSessions = null;

      function generateGUID() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                     s4() + '-' + s4() + s4() + s4();
      }

      self.addObserver = function(observer) {
        if (self.blackCards) {
          observer.$apply(function(scope) {
            scope.blackCards = self.blackCards;
          });
          observer.setBlackCards(self.blackCards);
        }
        if (self.observers.indexOf(observer) === -1) {
          self.observers.push(observer);
        }
      };

      self.addNotificationObserver = function(observer) {
        if (self.currentSessions) {
          observer.$apply(function(scope) {
            observer.notifications = self.currentSessions;
          });
        }
        self.notificationsObserver.push(observer);
      };

      var uri = 'http://37.187.225.223/angel/index.php/api/getGameSession/' +
        getCookie('UID');
      $.ajax({
        dataType: 'json',
        url: uri,
        success: function(data) {
          self.currentSessions = data;
          for (var i = 0; i < self.notificationsObserver.length; i++) {
            self.notificationsObserver[i].$apply(function(scope) {
              scope.notifications = data;
            });
          }
        }
      });

      Get3BlackCards(function(data) {
        for (var i = 0; i < self.observers.length; i++) {
          self.observers[i].$apply(function(scope) {
            scope.blackCards = data;
          });
        }
        self.blackCards = data;
      });
  }]);

  Users.controller('UserNotificationsController', ['$scope', 'UsersService',
    function($scope, UsersService) {
      $scope.notifications = [];

      UsersService.addNotificationObserver($scope);
  }]);

  Users.controller('UsersController', ['$scope', 'UsersService',
    function($scope, UsersService) {
      $scope.blackCards = [];

      UsersService.addObserver($scope);
      $scope.selectCard = function(id) {
        init(id, UsersService.sessionId, function(data) {
          debugger
          if (data.error) {
            console.log('Failed to start new game session');
          } else {
            console.log('New Game Session Started');
          }
        });
      }
  }]);
})();
