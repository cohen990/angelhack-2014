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
