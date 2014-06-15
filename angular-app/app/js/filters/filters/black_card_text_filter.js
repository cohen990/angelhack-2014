(function() {
  'use strict';

  angular.module('Filters').filter('blackCardText', function() {
    return function(text) {
      return text.replace(/_+/g, '<span class="card-blank">           </span>');
    };
  });
})();
