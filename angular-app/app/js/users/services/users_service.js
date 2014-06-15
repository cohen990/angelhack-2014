(function() {
  'use strict';

  angular.module('Users').service('UsersService', ['$http', '$cookies',
    function($http, $cookies) {
      var self = this;
      var BASE_URL = 'http://37.187.225.223/angel/index.php/api';
      self.observers = [];
      self.notificationsObserver = [];
      self.sessionId = self.sessionId || generateGUID();
      self.blackCards = null;
      self.currentSessions = null;
      self.availableSessions = null;

      function generateGUID() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                     s4() + '-' + s4() + s4() + s4();
      }

      self.getAvailableSessions = function(callback) {
        if (self.availableSessions) {
          callback(self.availableSessions);
        } else {
          var uri = BASE_URL + '/getAllGamesAvailable/' + $cookies.UID;
          $http({method: 'GET', url: uri})
            .success(function(data, status, headers, config) {
              self.availableSessions = data;
              callback(data);
            });
        }
      };

      self.getResponsesFor = function(blackCardId, callback) {
        var uri = BASE_URL + '/getGameResponse/' + blackCardId;
        $http({method: 'GET', url: uri}).success(callback);
      };

      self.submitResponseFor = function(blackCardId, whiteCardId, callback) {
        var uri = BASE_URL + '/setGameResponse/' + $cookies.UID + '/' +
          whiteCardId + '/' + self.sessionId + '/' + blackCardId;
        $http({method: 'GET', url: uri}).success(callback);
      };

      self.getRandomChoices = function(callback) {
        var uri = BASE_URL + '/getRandomWhiteCard/5';
        $http({method: 'GET', url: uri}).success(callback);
      };

      self.addObserver = function(observer) {
        if (self.blackCards) {
          observer.onBlackCardsAdded(self.blackCards);
        }
        if (self.observers.indexOf(observer) === -1) {
          self.observers.push(observer);
        }
      };

      self.addNotificationObserver = function(observer) {
        if (self.currentSessions) {
          observer.onNotificationsUpdate(self.currentSessions);
        }
        self.notificationsObserver.push(observer);
      };

      var uri = BASE_URL + '/getGameSession/' + $cookies.UID;
      $http({method: 'GET', url: uri})
        .success(function(data, status, headers, config) {
          self.currentSessions = data;
          for (var i = 0; i < self.notificationsObserver.length; i++) {
            self.notificationsObserver[i].onNotificationsUpdate(data);
          }
        });

      Get3BlackCards(function(data) {
        for (var i = 0; i < self.observers.length; i++) {
          self.observers[i].$apply(function(scope) {
            scope.onBlackCardsAdded(data);
          });
        }
        self.blackCards = data;
      });
  }]);
})();
