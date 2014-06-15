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
