var secrets = require('./configuration'),
	elb = require("./elb"),
	db = require("./db");

module.exports = {

	proxyRules : function(action, qaname, app, restart) {
		elb[action](qaname, app.http_forward_host || ('localhost:' + app.http_forward_port)); //Main Web
		terminalRules(qaname, app);
		function terminalRules(qaname, app, httpAlso) {
			elb[action]('terminal-' + qaname + app.name, app.terminal_forward_host || ('localhost:' + app.terminal_forward_port));
			httpAlso && elb[action](qaname + app.name, app.http_forward_host || ('localhost:' + app.http_forward_port));
			app.dependency = app.dependency || [];
			app.dependency.forEach(function(d){
				terminalRules(qaname, d, true);
			});
		}
	},

	completeAction : function(dbName, stream, exitCode, updateData, name) {
		stream.completed = true;
		if(exitCode === 0) {
			stream.data = '';
			updateData.streamId = null;
		}
		db.update(dbName, name, updateData, function(err){
			if(err) stream.data += err;
			stream.redirect = {location : ''}; //Refresh the page, because this event is completed
		});
	},

	getParams : function(dockerfile) {
		var params = dockerfile.match(/ENV PARAM_.+(?=\n||$)/g) || [];
		return params.map(function(p){
			return {
				param : p,
				name : /ENV PARAM_(\w+)/.exec(p)[1],
				value : /ENV PARAM_.+\s(.+$)/.exec(p)[1]
			};
		});
	},

	setParams : function(dockerfile, params) {
		params = params || [];
		params.forEach(function(param){
			var reg = new RegExp("ENV PARAM_" + param.name + ".+(?=\\n||$)", "g");
			dockerfile = dockerfile.replace(reg, 'ENV PARAM_' + param.name + ' ' + param.value);
		});
		return dockerfile;
	},

	renderData : function(req) {
		return {
			user : req.session.user,
			gaTrackingId : secrets.config.gaTrackingId
		};
	},

	getServerlist : function(cb){
		db.read('qa', cb);
	},

	getImagelist : function(cb){
		db.read('image', cb);
	},

	errorHandler : function(req, res) {
		res.render('error');
	},

	isAdmin : function(email) {
		return secrets.config.admin.indexOf(email) > -1;
	},

	unlessMW : function(path, middleware) {
	    return function(req, res, next) {
	        if(req.url.match(path)) next();
	        else middleware.apply(this, arguments);
	    };
	},

	getClusterNodes : function() {
		var nodes = {},
		cData = secrets.config.cluster;
		nodes[cData.master.internal_ip] = cData.master.public_ip;
		cData.nodes.forEach && cData.nodes.forEach(function(n) {
			nodes[n.internal_ip] = n.public_ip;
		});
		return nodes;
	}
};







