"use strict";

var	http = require('http'),
	httpProxy = require('http-proxy'),
	options = {
		"xfwd": true
	},
	fs = require('fs'),
<<<<<<< HEAD
	qs = require('qs'),
	Docker = require('dockerode'),
	hostile = require('hostile'),
	d,
	dockerMachineIp = process.env.DOCKER_HOST.replace(/:\d+$/,'').replace(/^\D+/,'') || '192.168.99.100';
=======
	qs = require('qs');
>>>>>>> 9f2f29f3dc7561adc08c2e95a92025e0bd21aa10

const ENDPOINT = 'app-registry.local.dev';

var respond = function(req,res) {
	var responseheaders = {"Content-Type": "application/json"};
	var data = JSON.stringify(ambassadors);
	res.writeHead(200,'ok',responseheaders);
	console.log(req.url,req.method);
	res.write(data);
	res.end();
};

var ambassadors = {};

var flushAmbassadors = function(cb) {
	var err = null, ok =1;
	Object.keys(ambassadors).forEach(function(permalink){
		hostile.remove('127.0.0.1',permalink);
	});
	hostile.remove('127.0.0.1',ENDPOINT);
	ambassadors = {};
	cb(err,ok);
}

var regenerateAmbassadors = function(cb) {
	d.listContainers(function (err, containers) {
		containers.forEach(function(container) {
			var isAmbassador = true;
			var port = null;
			var permalink = null;
			if (container.Labels['io.sjc.orchestra.service.ambassador'] !== "true") {
				isAmbassador = false;
			}
			var ambassador = {
			    created: container.Created,
			    project: container.Labels['io.sjc.orchestra.project'],
			    app: container.Labels['io.sjc.orchestra.app.slug'],
			    branch: container.Labels['io.sjc.orchestra.ref'],
			    service: container.Labels['io.sjc.orchestra.service.name'],
			    ambassador: isAmbassador,
			    mounted: container.Labels['io.sjc.orchestra.service.volumeMounted'],
			    permalink: permalink,
			    status: container.Status
			};
			if (isAmbassador && container.Ports.length && container.Ports[0].PublicPort) {
				port = container.Ports[0].PublicPort;
				permalink = [ambassador.project,ambassador.app,ambassador.branch,ambassador.service,'dev'].join(".");
			}
			ambassador.port = port;
			ambassador.permalink = permalink;
			if (permalink) {
				ambassadors[permalink] = ambassador;
				hostile.set('127.0.0.1', permalink);
			}
		});
		hostile.set('127.0.0.1',ENDPOINT);
		cb(err,ambassadors);
	});
};

<<<<<<< HEAD
regenerateAmbassadors(function(){
	//	just seeding. no action required.
});

switch (process.platform.toLowerCase()) {

	case 'darwin':
	d = new Docker({
		host: dockerMachineIp,
		port: process.env.DOCKER_HOST.replace(/^.*:/,'') || 2376,
		ca: fs.readFileSync( process.env.DOCKER_CERT_PATH + '/ca.pem', {encoding: "utf8"}),
		cert: fs.readFileSync( process.env.DOCKER_CERT_PATH + '/cert.pem', {encoding: "utf8"}),
		key: fs.readFileSync( process.env.DOCKER_CERT_PATH + '/key.pem', {encoding: "utf8"})
	});
	break;
	case 'linux':
	d = new Docker();
	default:

	break;
}


var server = http.createServer(function(req, res) {

	//	local registry
=======
var ambassadors = {};

var respond = function(req,res) {
	var responseheaders = {"Content-Type": "application/json"};
	var data = JSON.stringify({
		"url": req.url,
		"method": req.method,
		"headers": req.headers,
		"isRegistryRequest": true,
		"ambassadors": ambassadors
	});
	res.writeHead(200,'ok',responseheaders);
	res.write(data);
	res.end();
};

var server = http.createServer(function(req, res) {

	var isRegistryRequest = false;

	var formdata = '';
	//	local registroy
>>>>>>> 9f2f29f3dc7561adc08c2e95a92025e0bd21aa10
	switch (req.headers.host) {
		case 'app-registry.local.dev':
		isRegistryRequest = true;
		switch (req.method) {
			case 'GET':
<<<<<<< HEAD
			break;
			case 'POST':
			req.on('end',function() {
				regenerateAmbassadors(function(){
					respond(req,res);	
				});
			});
=======
			respond(req,res);
			break;
			case 'POST':
		    req.on('data', function(chunk) {
		    	var appobject = qs.parse(chunk.toString());
		    	for (var k in appobject) {
		    		ambassadors[k] = appobject[k];
		    	}
		    });
		    req.on('end',function() {
		    	respond(req,res);
		    });
>>>>>>> 9f2f29f3dc7561adc08c2e95a92025e0bd21aa10
			break;
			case 'PUT':
			respond(req,res);
			break;
			case 'DELETE':
<<<<<<< HEAD
			flushAmbassadors(function(err,ok){
				respond(req,res);	
			});
=======
			respond(req,res);
>>>>>>> 9f2f29f3dc7561adc08c2e95a92025e0bd21aa10
			break;
		}
		break;
		default:
<<<<<<< HEAD

=======
>>>>>>> 9f2f29f3dc7561adc08c2e95a92025e0bd21aa10
		if (req.headers.host in ambassadors) {
			//	the host matches a known ambassador
			var target = ambassadors[req.headers.host];
			var target;
			var proxy = httpProxy.createProxyServer({});
			var options = {};
			proxy.on('proxyReq', function(proxyReq, req, res, options) {
<<<<<<< HEAD
				proxyReq.setHeader('X-Orchestra-Version', 'v0.0.1');
			});
			proxy.on('error',function(e){
				console.error({
					"proxyError": e,
					"requst": {
						"url": req.url,
						"headers": req.headers
					}
				});
				var headers = {
					"Content-Type": "text/html"
				};
				res.writeHead(500,'server error',headers);
				fs.readFile('./500.html','utf8',function(err,data){
					if (err) {
						res.write('error 500!');
						console.error(err);
					} else {
						//res.write( JSON.stringify(e) );
						res.write(data);
					}
					res.end();
				});
			});
=======
				proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
			});
			proxy.on('error',function(e){
				console.error({
					"proxyError": e,
					"requst": {
						"url": req.url,
						"headers": req.headers
					}
				});
				var headers = {
					"Content-Type": "text/html"
				};
				res.writeHead(500,'server error',headers);
				fs.readFile('./500.html',function(err,data){
					if (err) {
						res.write('error 500!');
						console.error(err);
					} else {
						res.write( JSON.stringify(e) );
						res.write(data);
					}
					res.end();
				});
			});
>>>>>>> 9f2f29f3dc7561adc08c2e95a92025e0bd21aa10
			console.info(JSON.stringify({
				"request": {
					"headers": req.headers,
					"url": req.url
				},
				"target": target,
				"ts": process.hrtime()
<<<<<<< HEAD
			}));
			options.target = 'http://'+dockerMachineIp+':'+target.port;
			proxy.web(req, res, options);
		} else {
			//	the host header does not match a known ambassador
			var headers = {};
=======
			}));					
			options.target = 'http://'+req.headers.host+':'+target.runningAmbassador.port;
			proxy.web(req, res, options);
		} else {
			//	the host header does not match a known ambassador
			var headers = {
				"Content-Type": "text/html"
			};
>>>>>>> 9f2f29f3dc7561adc08c2e95a92025e0bd21aa10
			res.writeHead(404,'not found',headers);
			fs.readFile('./404.html','utf8',function(err,data){
				if (err) {
					headers["Content-Type"] = "text/html";
					res.write(data);
					console.error(err);
				} else {
					headers["Content-Type"] = "application/json";
					res.write('{"error": 404}');
				}
				res.end();
			});
		}
<<<<<<< HEAD

		break;
	}

=======
		break;
	}
>>>>>>> 9f2f29f3dc7561adc08c2e95a92025e0bd21aa10
});

server.listen(8080);
