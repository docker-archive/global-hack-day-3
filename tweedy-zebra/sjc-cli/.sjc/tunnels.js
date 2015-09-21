"use strict";

var request 	= require('request');
var action 		= process.argv[2];
var appname 	= process.argv[3];
var thecontainer= process.argv[4];
var thebranch 	= process.argv[5];
var theport 	= process.argv[6];

const ENDPOINT = 'http://127.0.0.1:4040/api';

var options = {
	"headers": {
		"Content-Type": "application/json",
		"authtoken": "3Z3drFFDGKuqmcddx947V_7JQhjea7y1NH8evpsgu7z"
	}
};

switch (action) {
	case 'list':
	options.method = "GET";
	options.url = ENDPOINT + '/tunnels';
	request(options,function(err,response,body){
		if (err) throw err;
		var res = JSON.parse(body);
		var r = res.tunnels.map(function(tunnel,i){
			return {
				"name": tunnel.name,
				"public": tunnel.public_url,
				"local": tunnel.config.addr
			};
		});
		console.log(r);
	});
	break;
	case 'create':
	options.method = "POST";
	options.url = ENDPOINT + '/tunnels';
	options.form = {
		proto: "http",
		bind_tls: false,
		addr: [appname,thebranch,"ngrok","dev"].join('.') + ':' + theport,
		name: thecontainer,
		authtoken: "3Z3drFFDGKuqmcddx947V_7JQhjea7y1NH8evpsgu7z"
	};
	/*
	request.post(options,function(err,httpresonse,body){
		if (err) {
			console.error(err);
			throw err;	
		}
		console.log(httpresonse,body);		
	});
	*/
	console.log(options);
	break;
}


