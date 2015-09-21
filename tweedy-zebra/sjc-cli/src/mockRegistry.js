"use strict";

var response = [];

var endpoint = function(handle,provider,host) {
    var r = {
        handle: handle,
        provider: provider,
        host: host
    };
    return r;
};

var row = function(appname,branch,port,endpoints,repo){
    var r = {
        appname: appname,
        branch: branch,
        port: port,
        endpoints: endpoints,
        repo: repo
    };
    return r;
}

response.push(row('cerebrum', 'master', 48394, enpoint('prod','amazon','324.43.42.19'), 'https://github.com/stjosephcontent/cerebrum'));
response.push(row('cerebrum', 'stage', 48394, enpoint('stage','amazon','324.80.99.101'), 'https://github.com/stjosephcontent/cerebrum/tree/stage'));
response.push(row('cerebrum', 'CE-43', 48394, enpoint('amazon','324.43.42.19'), 'https://github.com/stjosephcontent/cerebrum/tree/CE-43'));

response.push(row('canonfeatures', 'master', 48394, enpoint('prod','amazon','324.43.42.19'), 'https://github.com/stjosephcontent/canonfeatures'));
response.push(row('canonfeatures', 'dockerized', 48394, enpoint('stage','amazon','324.80.99.101'), 'https://github.com/stjosephcontent/canonfeatures/tree/dockerized'));
response.push(row('canonfeatures', 'CF-88', 48394, enpoint('amazon','324.43.42.19'), 'https://github.com/stjosephcontent/canonfeatures/tree/CF-88'));

response.push(row('cerrocoyote', 'develop', 48394, enpoint('amazon','324.43.42.19'), 'https://github.com/stjosephcontent/cerrocoyote/tree/develop'));

module.exports = function(resource,representation,queryparams) {

    switch (resource) {
        case 'applications':
        var r = response;
        break;
    }

    return new Promise(function(resolve,reject){
        resolve(r);
    });

};