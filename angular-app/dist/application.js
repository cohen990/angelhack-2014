(function() {
  'use strict';

  window.App = angular.module('App', ['Games', 'Users', 'mobile-angular-ui', 'ngRoute', 'ngTouch']);

  window.App.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', { templateUrl: 'templates/all-games.html' });
    $routeProvider.when('/new-game', { templateUrl: 'templates/new-game.html' });
    $routeProvider.when('/stats', { templateUrl: 'templates/stats.html' });
    $routeProvider.when('/game/:gameId', { templateUrl: 'templates/show-game.html' });
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

  angular.module('Games').controller('GamesController', ['$scope', '$routeParams', 'UsersService', '$http',
    function($scope, $routeParams, UsersService, $http) {
      $scope.game = null;

      $scope.submitResponse = function(whiteCardId) {
        UsersService.submitResponseFor($scope.game.blackCardId, whiteCardId, function() {
          console.log('Success!');
        });
      };

      $scope.onNotificationsUpdate = function(notifications) {
        if ($routeParams.gameId && UsersService.currentSessions) {
          var found = false;
          for (var i = 0; i < notifications.length; i++) {
            if (notifications[i].id_sbc === $routeParams.gameId) {
              $scope.game = {
                blackCard: notifications[i],
                mine: true,
                responses: null
              };
              UsersService.getResponsesFor(notifications[i].id_sbc,
                function(data, status, headers, config) {
                  $scope.game.responses = data;
              });
              found = true;
              break;
            }
          }

          if (!found) {
            $scope.game = {
              blackCard: null,
              mine: false,
              choices: null
            };
            UsersService.getRandomChoices(function(data, status, headers, config) {
              $scope.game.choices = data;
            });
          }
        }
      };

      UsersService.addNotificationObserver($scope);
  }]);
})();

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

(function() {
  'use strict';

  angular.module('Games').controller('NewGamesController', ['$scope', 'UsersService',
    function($scope, UsersService) {
      $scope.blackCards = [];

      $scope.onBlackCardsAdded = function(cards) {
        $scope.blackCards = cards;
      };

      UsersService.addObserver($scope);
      $scope.selectCard = function(id) {
        init(id, UsersService.sessionId, function(data) {
          if (data.error) {
            console.log('Failed to start new game session');
          } else {
            console.log('New Game Session Started');
          }
        });
      }
  }]);
})();

(function() {
  'use strict';

  angular.module('Users', ['ngCookies']);
})();

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
