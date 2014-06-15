(function() {
  'use strict';

  angular.module('Users').service('UsersService', ['$http', '$cookies', 'PubNubService',
    function($http, $cookies, PubNubService) {
      var self = this;
      var BASE_URL = 'http://37.187.225.223/angel/index.php/api';
      self.BASE_URL = BASE_URL;
      self.observers = [];
      self.notificationsObserver = [];
      self.blackCards = [];
      window.black = self.blackCards;
      self.whiteCards = [];
      self.currentSessions = [];
      self.availableSessions = null;
      self.username = null;

      self.generateGUID = function() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                     s4() + '-' + s4() + s4() + s4();
      };

      self.onMessage = function(message) {
        console.log(message);
        switch (message.type) {
          case 'new-game':
            self.addBlackCard(message.payload);
            break

          case 'new-response':
            self.addWhiteCard(message.payload);
            break

          default:
            console.log('DEFAULT');
            console.log(message);
        }
      };

      PubNubService.addMessageListener(self.onMessage);

      self.getBlackCard = function(uid, callback) {
        for (var i = 0; i < self.blackCards.length; i++) {
          if (self.blackCards[i].sid === uid) {
            callback(self.blackCards[i]);
            return self.blackCards[i];
          }
        }
      }

      self.getAvailableSessions = function(callback) {
        var array = [];
        for (var i = 0; i < self.blackCards.length; i++) {
          if (self.blackCards[i].uid !== $cookies.UID) {
            array.push(self.blackCards[i]);
          }
        }
        callback(array);
        return array;
      };

      self.getResponsesFor = function(blackCardId, callback) {
        var card = self.getBlackCard(sid);
        callback(card.responses);
        return card.responses;
      };

      self.startNewGame = function(blackCard, sid) {
        PubNubService.publish({
          type: 'new-game',
          payload: {
            sid: sid,
            uid: $cookies.UID,
            username: self.username,
            text: blackCard.text,
            responses: []
          }
        });
      };

      self.submitResponseFor = function(blackCard, whiteCard) {
        PubNubService.publish({
          type: 'new-response',
          payload: {
            blackCardSID: blackCard.sid,
            uid: $cookies.UID,
            username: self.username,
            text: whiteCard.text
          }
        });
      };

      self.getRandomChoices = function(callback) {
        var uri = BASE_URL + '/getRandomWhiteCard/5';
        $http({method: 'GET', url: uri}).success(callback);
      };

      self.addBlackCard = function() {
        self.blackCards.push.apply(self.blackCards, arguments);
        for (var i = 0; i < self.notificationsObserver.length; i++) {
          self.notificationsObserver[i].onNotificationsUpdate(self.blackCards);
        }
      };

      self.addWhiteCard = function(card) {
        self.getBlackCard(card.blackCardSID, function(blackCard) {
          blackCard.responses.push(card);
          for (var i = 0; i < self.notificationsObserver.length; i++) {
            self.notificationsObserver[i].onNotificationsUpdate(self.blackCards);
          }
        });
      };

      self.addNotificationObserver = function(observer) {
        if (self.currentSessions) {
          observer.onNotificationsUpdate(self.currentSessions);
        }
        self.notificationsObserver.push(observer);
      };

      self.getNewBlackCards = function(callback) {
        Get3BlackCards(callback);
      }
  }]);
})();
