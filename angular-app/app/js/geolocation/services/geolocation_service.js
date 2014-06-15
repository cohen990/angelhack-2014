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
