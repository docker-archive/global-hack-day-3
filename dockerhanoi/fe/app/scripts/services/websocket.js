'use strict';
angular.module('DockerizeApp').factory('Websocket', function($websocket, APP_CONFIG) {
    return {
        logs: function(id){
            // Open a WebSocket connection
            var dataStream = $websocket(APP_CONFIG.services.websockets.logs);

            var collection = ['', 'Loading ... \n'];

            dataStream.onMessage(function(message) {
                collection.push(message.data);
            });

            dataStream.onOpen(function() {
                dataStream.send(id);
            });
            var methods = {
                collection: collection,
            };

            return methods;
        }
    };
});
