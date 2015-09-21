var express = require('express');
var router = express.Router();
var common = require('../services/common');
var secrets = require('../services/configuration');


router.get('/*', function(req, res, next) {
	if(!secrets.config.underMaintenance) return next();
	if(common.isAdmin(req.session.user && req.session.user.email)) {
		next();
	} else {
		res.render('maintenance', {common : common.renderData(req)});
	}
});

module.exports = router;