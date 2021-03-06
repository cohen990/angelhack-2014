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
