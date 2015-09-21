"use strict";
var express = require('express'),
	router = express.Router(),
	request = require('request'),
	secrets = require('../services/configuration'),
	common = require('../services/common.js'),
	hacks = require('../services/hacks.js'),
	path = require('path'),
	fs = require('fs');

router.get('/admin/configuration', function(req, res, next){
	if(notAdmin(req)) return next();
	res.render('configuration', {
		common : common.renderData(req),
		config : secrets.config,
		newNodeSetup : 'curl -sSL https://raw.githubusercontent.com/dockerx/global-hack-day-3/master/DockerBox_Bangalore/node-setup.sh | sh -s ' + (secrets.config.cluster.master.internal_ip || '<master-ip>')
	});
});

router.post('/admin/configuration', function(req, res, next){
	if(notAdmin(req)) return next();
	var config;
	try {
		config = JSON.parse(req.body.config);
	} catch(e) {
		return res.json({
				status : 'error',
				err : 'JSON Parse error'
			});
	}
	fs.writeFileSync(path.join(__dirname, '../secrets.json'), req.body.config);
	var oldNodeIps = getNodeIps(secrets.config),
	newNodeIps = getNodeIps(secrets.config);

	secrets.config = config;
	//if( (JSON.stringify(oldNodeIps) != JSON.stringify(newNodeIps) ) && config.cluster.master.internal_ip) hacks.swarmManager();
	config.swarm_host = null;
	hacks.swarmManager(function(port){
		config.swarm_host = 'tcp://' + config.cluster.master.internal_ip + ':' + port;
	});
	res.redirect('/admin/configuration');
});

router.all(['/admin/database', '/admin/database/*'], function(req, res, next) {
    if(notAdmin(req)) return next();
    req.pipe(request(getUrl(req.url))).pipe(res);

    function getUrl(url) {
	    //Path.join is not working with request.pipe. So this hack for removing the extra / in the secrets.db
	    return secrets.GLOBAL.db + url.replace(/^\/admin\/database/, '');
	}
});

function notAdmin(req) {
	return (!common.isAdmin(req.session.user && req.session.user.email));
}

module.exports = router;

//Utils

function getNodeIps(cfg) {
	var nodeHosts = [],
	nodes = cfg.cluster.nodes;
	nodeHosts.push(cfg.cluster.master.internal_ip);
	nodes.forEach && nodes.forEach(function(n){
		n.internal_ip && nodeHosts.push(n.internal_ip);
	});
	return nodeHosts;
}


