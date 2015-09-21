'use strict';
angular.module('DockerizeApp').service(
    'httpi',
    function( $http ) {
        // ---
        // PUBLIC METHODS.
        // ---
        // I proxy the $http service and merge the params and data values into
        // the URL before creating the underlying request.
        function httpProxy( config ) {
            config.url = interpolateUrl( config.url, config.params, config.data );
            return( $http( config ) );
        }
        // ---
        // PRIVATE METHODS.
        // ---
        // I move values from the params and data arguments into the URL where
        // there is a match for labels. When the match occurs, the key-value
        // pairs are removed from the parent object and merged into the string
        // value of the URL.
        function interpolateUrl( url, params, data ) {
            // Make sure we have an object to work with - makes the rest of the
            // logic easier.
            params = ( params || {} );
            data = ( data || {} );
            // Strip out the delimiter fluff that is only there for readability
            // of the optional label paths.
            url = url.replace( /(\(\s*|\s*\)|\s*\|\s*)/g, '' );
            // Replace each label in the URL (ex, :userID).
            url = url.replace(
                /:([a-z]\w*)/gi,
                function( $0, label ) {
                    // NOTE: Giving "data" precedence over "params".
                    return( popFirstKey( data, params, label ) || '' );
                }
            );
            // Strip out any repeating slashes (but NOT the http:// version).
            url = url.replace( /(^|[^:])[\/]{2,}/g, '$1/' );
            // Strip out any trailing slash.
            url = url.replace( /\/+$/i, '' );
            return( url );
        }
        // I take 1..N objects and a key and perform a popKey() action on the
        // first object that contains the given key. If other objects in the list
        // also have the key, they are ignored.
        function popFirstKey( object1, object2, objectN, key ) {
            // Convert the arguments list into a true array so we can easily
            // pluck values from either end.
            var objects = Array.prototype.slice.call( arguments );
            // The key will always be the last item in the argument collection.
            key = objects.pop();
            var object = objects.shift();
            // Iterate over the arguments, looking for the first object that
            // contains a reference to the given key.
            while ( object ) {
                if ( object.hasOwnProperty( key ) ) {
                    return( popKey( object, key ) );
                }
                object = objects.shift();
            }
        }
        // I delete the key from the given object and return the value.
        function popKey( object, key ) {
            var value = object[ key ];
            delete( object[ key ] );
            return( value );
        }
        // Return the public API.
        return( httpProxy );
    }
);
