(function() {
  'use strict';

  window.App = angular.module('App', ['Games', 'Users', 'mobile-angular-ui',
                              'ngRoute', 'ngTouch', 'GeoLocation', 'ngAnimate',
                              'Animations']);

  window.App.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', { templateUrl: 'templates/all-games.html' });
    $routeProvider.when('/new-game', { templateUrl: 'templates/new-game.html' });
    $routeProvider.when('/stats', { templateUrl: 'templates/stats.html' });
    $routeProvider.when('/game/:gameId', { templateUrl: 'templates/show-game.html' });
  });
})();
