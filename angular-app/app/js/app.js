(function() {
  'use strict';

  window.App = angular.module('App', ['Users', 'mobile-angular-ui', 'ngRoute']);

  window.App.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', { templateUrl: 'templates/search-games.html' });
    $routeProvider.when('/new-game', { templateUrl: 'templates/new-game.html' });
    $routeProvider.when('/stats', { templateUrl: 'templates/stats.html' });
  });
})();
