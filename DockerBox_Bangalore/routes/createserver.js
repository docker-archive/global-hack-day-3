"use strict";

var express = require('express');
var router = express.Router();
var db = require('../services/db');
var common = require('../services/common');
var docker = require('../docker');
var streamStore = require('../services/stream');
var restartHap = true;
var async = require('async');

//Constants
var reserverdNames = ['www'];
//Messages
var messages = {
	nameTaken : 'This name is already taken. Please try a different name.'
};

/* GET home page. */
router.get('/createserver', function(req, res, next) {
	async.parallel([common.getServerlist, common.getImagelist], function(err, result){
		if(err) return next();
		var servers = result[0],
		templates = servers.rows.map(function(d){return d.value}).filter(function(d){return d.publish}),
		images = result[1],
		imageMap = {};
		
		images.rows.map(function(i){return i.value;}).forEach(function(i){
			if(i.build_status === 0) imageMap[i.name] = i.port;
		});
		
		res.render('createserver', {
			title: '',
			templates: templates,
			images: imageMap,
			common : common.renderData(req)
		});
	});
});

router.post('/createserver', function(req, res) {
	var app = req.body.app,
	name = req.body.name,
	stream = streamStore.create();
	req.body.created_by = req.session.user;
	req.body.created_on = Date();
	req.body.streamId = stream.id;
	req.body.images_used = usedImages(app);

	//check if name already taken
	hostNameAvailable(name, function(err, available){
		if(available) proceed();
		else {
			res.json({
				status : 'error',
				err : err || messages.nameTaken
			});
		}
	});

	function proceed(){
		db.create('qa', name, req.body, function(err) {
			if (err) {
				res.json({
					status : 'error',
					err : err
				});
				return;
			}	
			docker.compose.start(name, app, stream, function(exitCode){
				var updateData = { // Updateing the app also, since the app object got the running host properties - http_forward_host, terminal_forward_host
					compose_status : exitCode,
					app : app
				};
				if(exitCode === 0) common.proxyRules('add', name, app, restartHap);
				common.completeAction('qa', stream, exitCode, updateData, name);
			});
			res.json({
				status : 'success',
				redirect : '/discover/server/'+name
			});	
		});
	}
});

router.post('/createserver/checkhostname', function(req, res) {
	hostNameAvailable(req.body.name, function(err, available){
		res.json({
			status : err || 'success',
			available : available,
			message : (!available ? messages.nameTaken : null) 
		});
	});
});

function hostNameAvailable(name, cb) {
	common.getServerlist(function(err, servers){
		servers.rows.forEach(function(doc){
			reserverdNames.push(doc.value.name);
		});
		cb(err, reserverdNames.indexOf(name) === -1);
	});
}

function usedImages(app) {
	var ui =[];
	some(app);
	function some(a) {
		ui.push(a.image);
		a.dependency && a.dependency.forEach(function(d){
			some(d);
		});
	}
	return ui;
}

module.exports = router;