"use strict";

var express = require('express');
var router = express.Router();
var db = require('../services/db');
var validation = require('../services/validation');
var common = require('../services/common');
var hacks = require('../services/hacks');
var docker = require('../docker');
var secrets = require('../services/configuration');
var async = require('async');

router.get('/discover/server/:servername', function(req, res, next) {
	db.read('qa', function(err, body) {
		if(err) return next();
		body.serverList = getServerList(body.app);
		body.sshIpMap = (body.compose_status === 0) ? getSshIpPort(body.app) : {};
		body.domainName = secrets.config.domainName;
		body.common = common.renderData(req);
		res.render('discoverserver', body);
	}, req.params.servername);

	function getServerList(app) {
		var ser = [];
		ser.push(app.image);
		doSome(app);

		function doSome(app) {
			if (!app.image) return;
			app.dependency && app.dependency.forEach(function(dep) {
				if (dep.image) ser.push(dep.image);
				doSome(dep);
			});
		};
		return ser;
	}

	function getSshIpPort(app) {
		var ser = {};
		ser[app.image] = getIpPort(app.ssh_forward_host);
		doSome(app);

		function doSome(app) {
			if (!app.image) return;
			app.dependency && app.dependency.forEach(function(dep) {
				if (dep.image) ser[dep.image] = getIpPort(dep.ssh_forward_host);
				doSome(dep);
			});
		};

		function getIpPort(fh) {
			if(!fh) return '';
			var s = fh.split(':');
			return 'ssh root@' + common.getClusterNodes()[s[0]] + ' -p ' + s[1];
		};

		return ser;
	}
});

router.post('/discover/server/delete/:servername', function(req, res) {
	db.read('qa', function(err, body) {	
		if(!validation.deleteAuth(body.created_by, req)){
			res.json({
				status : 'error',
				err : "You cannot delete this because its created by a different user."
			});
			return;
		}

		common.proxyRules('remove', body.name, body.app);
		docker.compose.stop(req.params.servername);
		db.delete('qa', function(err) {
			if (err) {
				res.json({
					status : 'error',
					err : err
				});
			} else {
				res.json({
					status : 'success',
					redirect : '/'
				});
			}
		}, req.params.servername, req.body._rev);
	}, req.params.servername);
});

router.post('/discover/server/publish/:servername', function(req, res) {
	db.read('qa', function(err, body) {	
		if(!validation.deleteAuth(body.created_by, req)){
			res.json({
				status : 'error',
				err : "You cannot do this action because its created by a different user."
			});
			return;
		}
	}, req.params.servername);

	var publish = req.body.publish;
	publish = (publish === true || publish === 'true') ? true : false;
	db.update('qa', req.params.servername, {publish : publish}, function(err){
		if (err) {
			res.json({
				status : 'error',
				err : err
			});
		} else {
			res.json({
				status : 'success',
				redirect : '/createserver'
			});
		}
	});
});

router.get('/discover/image/:imagename', function(req, res, next) {
	async.parallel([getImageData], function(err, result){
		if(err) return next();
		var body = result[0];
		body.common = common.renderData(req);
		res.render('createimage', body);
	});

	function getImageData(cb) {
		db.read('image', cb, req.params.imagename);
	}
	
});

router.post('/discover/image/delete/:imagename', function(req, res) {
	db.read('image', function(err, body) {
		if(!validation.deleteAuth(body.created_by, req)){
			res.json({
				status : 'error',
				err : "You cannot delete this because its created by a different user."
			});
			return;
		}

		async.series([deleteDockerImage, deleteFromDb], function(err, results) {
			if (err) {
				res.json({
					status : 'error',
					err : err
				});
			} else {
				res.json({
					status : 'success',
					redirect : '/'
				});
			}
		});

		function deleteDockerImage(cb) {
			hacks.removeImage(req.params.imagename, cb);
		}

		function deleteFromDb(cb) {
			db.delete('image', function(err) {
				cb(err);
			}, req.params.imagename, req.body._rev);
		}
	
	}, req.params.imagename);
});

module.exports = router;