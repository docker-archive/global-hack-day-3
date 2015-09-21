"use strict";

var express = require('express');
var router = express.Router();
var db = require('../services/db');
var common = require('../services/common');
var hacks = require('../services/hacks');
var streamStore = require('../services/stream');
var docker = require('../docker');
var async = require('async');

/* GET home page. */
router.get('/createimage', function(req, res) {
	res.render('createimage', { 
		title: '',
		common : common.renderData(req)
	});
});

router.post('/createimage', function(req, res) {
	var stream = streamStore.create(),
	tasks = [];
	if(isNewImage(req)) {
		req.body.created_by = req.session.user;
		req.body.created_on = Date();
		tasks.push(createImageinDB);
	} else {
		tasks.push(deleteDockerImage);
		tasks.push(updateImageinDB);
	}

	tasks.push(buildImage);
	
	req.body.last_updated_by = req.session.user;
	req.body.last_updated_on = Date();
	req.body.streamId = stream.id;
	req.body.params = common.getParams(req.body.dockerfile);

	var name = req.body.name;

	async.series(tasks, function(err, result){
		if (err) {
			res.json({
				status : 'error',
				err : err
			});
		} else {
			res.json({
				status : 'success',
				redirect : '/discover/image/'+name
			});
		}
	});
	
	function deleteDockerImage(cb) {
		hacks.removeImage(name, cb);
	}

	function createImageinDB(cb) {
		db.create('image', name, req.body, function(err, body, header) {
			cb(err);
		});
	}

	function updateImageinDB(cb) {
		db.update('image', name, req.body, function(err, body, header) {
			cb(err);
		});
	}

	function buildImage(cb) {
		docker.image.create(name, req.body.dockerfile, stream, function(exitCode){
			var updateData = {build_status : exitCode};
			common.completeAction('image', stream, exitCode, updateData, name);
		});
		cb(null);
	}

});

function isNewImage(req) {
	return !req.body._id
}

module.exports = router;