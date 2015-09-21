"use strict";

var express = require('express');
var router = express.Router();
var db = require('../services/db');
var common = require('../services/common');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res) {
	async.parallel([common.getServerlist, common.getImagelist], function(err, result){
		if(err) res.send(err);
		else res.render('landing', landingPageCollection(result, req));
	});
});

module.exports = router;

function landingPageCollection(result, req) {
	return {
		images : getImages(),
		servers : getServers(),
		common : common.renderData(req)
	}

	function getServers() {
		return result[0];
	}
	function getImages() {
		var images = result[1],
		newList = {
			rows : [],
			clonemap : {}
		};
		images.rows.forEach(function(doc){
			var clonemap = newList.clonemap;
			if(!doc.value.clone_of) newList.rows.push(doc);
			else {
				if(!clonemap[doc.value.clone_of]) clonemap[doc.value.clone_of] = [];
				clonemap[doc.value.clone_of].push(doc);
			}
		});
		return newList;
	}
}



function getMasterImages(){}