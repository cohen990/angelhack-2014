(function() {
  'use strict';

  angular.module('Users').service('UsersService', ['$http', '$cookies', 'PubNubService',
    function($http, $cookies, PubNubService) {
      var self = this;
      var BASE_URL = 'http://37.187.225.223/angel/index.php/api';
      self.BASE_URL = BASE_URL;
      self.observers = [];
      self.notificationsObserver = [];
      self.blackCards = null;
      self.currentSessions = [];
      self.availableSessions = null;

      self.generateGUID = function() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                     s4() + '-' + s4() + s4() + s4();
      };

      PubNubService.addMessageListener(function(message) {
        if (message.uid === $cookies.UID) return;

        switch (message.type) {
          case 'new-game':
            self.getBlackCard(message.uid, function(data) {
              self.addBlackCard.apply(self, data);
            });
            break

          default:
            console.log('DEFAULT');
            console.log(message);
        }
      });

      self.getBlackCard = function(uid, callback) {
        var uri = self.BASE_URL + '/getGameSessionBlackCard/' + uid;
        $http({method: 'GET', url: uri}).success(function(data, status, headers, config) {
          if (data.error) {
            console.log(data.error);
          } else {
            self.addBlackCard.apply(self, data);
            callback(data);
          }
        }).error(function(e) {
          console.log(e);
        });
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

      self.startNewGame = function(blackCard, sid, callback) {
        PubNubService.publishNewGame(sid, $cookies.UID);

        var uri = BASE_URL + '/setGameSession/' + $cookies.UID + '/' +
          blackCard.id_bc + '/' + sid + '/' +
          Math.floor((new Date())/1000);
        $http({method: 'GET', url: uri})
          .success(callback).error(function(error) {
            console.log(error);
            alert(error);
          });
      };

      self.submitResponseFor = function(blackCard, whiteCardId, callback) {
        var uri = BASE_URL + '/setGameResponse/' + $cookies.UID + '/' +
          whiteCardId + '/' + blackCard.sid + '/' + blackCard.id_sbc;
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

      self.addBlackCard = function() {
        self.currentSessions.push.apply(self.currentSessions, arguments);
        for (var i = 0; i < self.notificationsObserver; i++) {
          self.notificationsObserver[i].onNotificationsUpdate(self.currentSessions);
        }
      };

      self.addNotificationObserver = function(observer) {
        if (self.currentSessions) {
          observer.onNotificationsUpdate(self.currentSessions);
        }
        self.notificationsObserver.push(observer);
      };


      if ($cookies.UID) {
        var uri = BASE_URL + '/getGameSession/' + $cookies.UID;
        $http({method: 'GET', url: uri})
          .success(function(data, status, headers, config) {
            if (data.error) {
              alert(data.error);
            } else {
              self.addBlackCard.apply(self, data);
            }
          });
      }

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
