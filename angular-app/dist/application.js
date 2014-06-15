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

  angular.module('Games').controller('GameNotificationsController', ['$scope', 'UsersService',
    function($scope, UsersService) {
      $scope.notifications = [];

      $scope.onNotificationsUpdate = function(notifications) {
        $scope.notifications = notifications;
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

      $scope.submitResponse = function(whiteCardId) {
        UsersService.submitResponseFor($scope.game.blackCard, whiteCardId, function() {
          console.log('Success!');
        });
      };

      $scope.onNotificationsUpdate = function(notifications) {
        console.log('updated');
        if ($routeParams.gameUID && UsersService.currentSessions) {
          var found = false;
          for (var i = 0; i < notifications.length; i++) {
            if (notifications[i].id_sbc === $routeParams.gameUID) {
              $scope.game = {
                blackCard: notifications[i],
                mine: true,
                responses: null
              };
              console.log('found');
              console.log(notifications[i]);
              UsersService.getResponsesFor(notifications[i].id_sbc,
                function(data, status, headers, config) {
                  $scope.game.responses = data;
              });
              found = true;
              break;
            }
          }

          if (!found) {
            console.log('not found');
            $scope.game = {
              blackCard: null,
              mine: false,
              choices: null
            };
            UsersService.getBlackCard($routeParams.gameUID, function(data) {
              $scope.game = {
                blackCard: data[0],
                mine: (data[0].fk_uid === $cookies.UID),
                choices: null
              }
            });
            UsersService.getRandomChoices(function(data, status, headers, config) {
              $scope.game = {
                blackCard: $scope.game.blackCard,
                mine: (data[0].fk_uid === $cookies.UID),
                choices: data
              }
            });
          }
        }
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

      $scope.blackCards = [];

      $scope.onBlackCardsAdded = function(cards) {
        $scope.blackCards = cards;
      };

      UsersService.addObserver($scope);
      $scope.selectCard = function(blackCard) {
        var uid = UsersService.generateGUID();
        UsersService.startNewGame(blackCard, uid, function(data, status, header, config) {
          $location.path('/game/' + uid);
        });
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

    self.publishNewGame = function(sid, uid) {
      self.pubnubHandle.publish({
        channel: 'globalNewGame',
        message: {
          type: 'new-game',
          sid: sid,
          uid: uid
        }
      });
    };
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
