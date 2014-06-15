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
