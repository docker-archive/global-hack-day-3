var express = require('express');
var router = express.Router();
var common = require('../services/common');

router.get('/*', function(req, res, next) {
	res.render('notfound', {common : common.renderData(req)});
});

router.post('/*', function(req, res, next) {
	res.send(404);
});

module.exports = router;