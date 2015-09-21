//Expecting the elb to be running as a dependent app in docker-compose
var request = require('superagent'),
	config = require('./configuration'),
	elbUrl = config.GLOBAL.elbAdmin + '/',
	genCb = function(err, res){err && console.log(err);};

module.exports = {
	add: function(subDomainName, backendUri, cb) {		
		cb = cb || genCb;
		request
			.post(elbUrl + 'addnewproxy')
			.send({"hostname" : subDomainName + '.', "rule" : "pathbeg", "backend" : {"uris" : [backendUri]}})
			.set('Accept', 'application/json')
			.end(cb);
	},
	remove: function(subDomainName, backendUri, cb) {
		cb = cb || genCb;
		request
			.post(elbUrl + 'removehostrule')
			.send({"hostname" : subDomainName + '.'})
			.set('Accept', 'application/json')
			.end(cb);
	},
	default: function(defaultHost, cb) {
		cb = cb || genCb;
		request
			.post(elbUrl + 'addbackendsystem')
			.send({"backend":"default", "hosturi":defaultHost})
			.set('Accept', 'application/json')
			.end(cb);
	} 
}



/*


http://localhost:9090/currentconfig
http://localhost:9090/replaceconfig


{"HostRules":{"websomtep.":{"Rule":"pathbeg","Backend":"XVlBezgbaiC"}},"BackendStruct":{"XVlBezgbaiC":["50.112.1e16.235:80"]}}

*/