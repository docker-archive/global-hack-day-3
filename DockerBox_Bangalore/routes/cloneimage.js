"use strict";

var express = require('express');
var router = express.Router();
var db = require('../services/db');
var common = require('../services/common');
var streamStore = require('../services/stream');
var docker = require('../docker');
var async = require('async');

/* GET home page. */
router.get('/clone/image/:imagename', function(req, res) {
	async.parallel([getImageData], function(err, result){
		var body = result[0];
		body.common = common.renderData(req);
		res.render('cloneimage', body);
	});

	function getImageData(cb) {
		db.read('image', cb, req.params.imagename);
	}
	
});

router.post('/clone/image', function(req, res) {
	db.read('image', function(err, parentBody){
		var stream = streamStore.create();
		var body = {
			clone_of : parentBody.name,
			created_by : req.session.user,
			created_on : Date(),
			last_updated_by : req.session.user,
			last_updated_on : Date(),
			streamId : stream.id,
			name : req.body.name,
			port : parentBody.port,
			description : req.body.description,
			params : req.body.params,
			dockerfile : common.setParams(parentBody.dockerfile, req.body.params),
			build_status : 'processing'
		};

		db.create('image', req.body.name, body, function(err, b, header) {
			if (err) {
				res.json({
					status : 'error',
					err : err
				});
			} else {
				var name = req.body.name;
				docker.image.create(name, body.dockerfile, stream, function(exitCode){
					var updateData = {build_status : exitCode};
					common.completeAction('image', stream, exitCode, updateData, name);
				});

				res.json({
					status : 'success',
					redirect : '/discover/image/'+name
				});
			}
		});

	}, req.body.parentImageName);

});

module.exports = router;