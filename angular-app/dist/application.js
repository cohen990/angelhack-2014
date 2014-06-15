(function() {
  'use strict';

  window.App = angular.module('App', ['Games', 'Users', 'mobile-angular-ui',
                              'ngRoute', 'ngTouch', 'GeoLocation', 'ngAnimate',
                              'Animations', 'Filters', 'ngSanitize', 'PubNub']);

  window.App.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/login', { templateUrl: 'templates/login.html' });
    $routeProvider.when('/games', { templateUrl: 'templates/all-games.html' });
    $routeProvider.when('/new-game', { templateUrl: 'templates/new-game.html' });
    $routeProvider.when('/stats', { templateUrl: 'templates/stats.html' });
    $routeProvider.when('/game/:gameUID', { templateUrl: 'templates/show-game.html' });
    $routeProvider.otherwise({redirectTo: '/login'});
  });
})();

(function() {
  'use strict';

  angular.module('Animations', []);
})();

(function() {
  'use strict';

  angular.module('Animations').directive('animPop', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, element, attr) {
          var delay = Math.round(Math.random()*300 + 300);
          element.css({
            transitionDelay: '' + delay + 'ms',
          });

          element.addClass('anim-pop');
        }
      };
  }]);
})();

(function() {
  'use strict';

  angular.module('Filters', []);
})();

(function() {
  'use strict';

  angular.module('Filters').filter('blackCardText', function() {
    return function(text) {
      if (!text) return text;

      return text.replace(/_+/g, '<span class="card-blank">              </span>');
    };
  });
})();

(function() {
  'use strict';

  angular.module('Games', ['Users', 'ngRoute']);
})();

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

(function() {
  'use strict';
  var Games = angular.module('Games');

  Games.controller('GamesController', ['$scope', '$routeParams', 'UsersService', '$http', '$cookies',
    function($scope, $routeParams, UsersService, $http, $cookies) {
      $scope.game = null;

      $scope.submitResponse = function(whiteCard) {
        UsersService.submitResponseFor($scope.game.blackCard, whiteCard);
      };

      $scope.onNotificationsUpdate = function(cards) {
        UsersService.getBlackCard($routeParams.gameUID, function(data) {
          $scope.game = {
            blackCard: data,
            mine: (data.uid === $cookies.UID)
          }

          $scope.game.myResponse = null;
          for (var i = 0; i < data.responses.length; i++) {
            if (data.responses[i].uid === $cookies.UID) {
              $scope.game.myResponse = data.responses[i];
              break;
            }
          }

          if ($scope.game.mine !== true && !$scope.game.myResponse) {
            UsersService.getRandomChoices(function(data, status, headers, config) {
              $scope.game.choices = data;
            });
          }

          if(!$scope.$$phase) {
            $scope.$digest();
          }
        });
      };

      UsersService.addNotificationObserver($scope);
  }]);
})();

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
        if (!$scope.$$phase) $scope.$digest();
      });
  }]);
})();

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

(function() {
  'use strict';

  angular.module('GeoLocation', []);
})();

(function() {
  'use strict';

  angular.module('GeoLocation').service('GeoLocationService', [
    function() {
      var self = this;
      self.geolocationEnabled = !!navigator.geolocation;

      self.getCurrentPosition = function(callback) {
        if (self.geolocationEnabled) {
          var options = {
            enableHighAccuracy: true,
            timeout: Infinity,
            maximumAge: 1000*60*15
          };

          navigator.geolocation.getCurrentPosition(callback, function(error) {
            switch (error.code) {
              case error.PERMISSION_DENIED:
              case error.POSITION_UNAVAILABLE:
                self.geolocationEnabled = false;
                break;
              case error.TIMEOUT:
              case error.UNKNOWN_ERROR:
                break;
            }
            console.log(error);
          }, options);
        } else {
          callback({
            coords: {
              latitude: null,
              longitude: null
            }
          });
        }
      };
  }]);
})();

(function() {
  'use strict';

  var PubNub = angular.module('PubNub', []);

  PubNub.service('PubNubService', [function() {
    var self = this;
    self.pubnubHandle = self.pubnubHandle || PUBNUB.init({
        publish_key   : 'pub-c-d03f926e-5fb8-43a3-9a7f-4e2427bb4f35',
        subscribe_key : 'sub-c-aa73bdce-f3bd-11e3-bffd-02ee2ddab7fe'
    });
    window.pubnub = self.pubnubHandle;

    self.pubnubHandle.subscribe({
         channel : "globalNewGame",
         message : function(m){
           for (var i = 0; i < self.listeners.length; i++) {
             self.listeners[i](m);
           }
         }
    });

    self.listeners = [];
    self.addMessageListener = function(listener) {
      self.listeners.push(listener);
    };

    self.publish = function(message) {
      self.pubnubHandle.publish({
        channel: 'globalNewGame',
        message: message
      });
    };

    self.history = function() {
      return self.pubnubHandle.history();
    }
  }]);
})();

(function() {
  'use strict';

  angular.module('Users', ['ngCookies', 'PubNub']);
})();

(function() {
  'use strict';

  angular.module('Users').controller('UsersLoginController', ['$scope', '$http',
                                     '$cookies', 'UsersService', '$location',
    function($scope, $http, $cookies, UsersService, $location) {
      if ($cookies.UID) {
        $location.path('/games');
        return;
      }

      $scope.user = { name: null };

      $scope.submit = function(user) {
        var uri = UsersService.BASE_URL + '/getLoginInformation/' + user.name;
        UsersService.username = user.name;
        $http({method: 'GET', url: uri}).success(function(data, status, headers, config) {
          $cookies.UID = data;
          $location.path('/games');
        });
      };
  }]);
})();

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
