"use strict";

module.exports = function (app) {
	app.use('/', require('./gauth'));
	app.use('/', require('./maintenance'));
	app.use('/', require('./landing'));
	app.use('/', require('./discover'));
	app.use('/', require('./createserver'));
	app.use('/', require('./createimage'));
	app.use('/', require('./cloneimage'));
	app.use('/', require('./eventstream'));
	app.use('/', require('./admin'));
	app.use('/', require('./notfound'));
};