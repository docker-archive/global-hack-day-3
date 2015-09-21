//Expecting the couchDB to be running as a dependent app with host name db using docker-compose
var config = require('./configuration'),
	nano = require('nano')(config.GLOBAL.db),
	_ = require('underscore'),
	db = {};

// Constants
var views = {
	minlist : {
		qa : {
		   "language": "javascript",
		   "views": {
		       "minlist": {
		           "map": "function(doc) {\n  emit(doc.name, doc);\n}"
		       }
		   }
		},
		image : {
		   "language": "javascript",
		   "views": {
				"minlist": {
					"map": "function(doc) {\n  emit(doc.name, doc);\n}"
				},
				"cloneof": {
					"map": "function(doc) {\n  emit(doc.clone_of, doc);\n}"
				}
			}
		}
	}
}


module.exports = {
	init : function() {
		var self = this;
		nano.db.create('orchestrator-qa', function(err, body) {
			if(err) console.log(err);
			else console.log('Created the Qa db');
			db.qa = nano.db.use('orchestrator-qa');
			self.create('qa', '_design/minlist', views.minlist.qa);

		});
		nano.db.create('orchestrator-image', function(err, body) {
			if(err) console.log(err);
			else console.log('Created the App db');
			db.image = nano.db.use('orchestrator-image');
			self.create('image', '_design/minlist', views.minlist.image);
		});
	},

	create: function(dbname, name, data, cb) {
		db[dbname].insert(data, name, function(err, body, header) {
			if (err) {
				console.log('[db.insert] ', err.message);
			}
			cb && cb(err, body, header);
		});
	},
	read: function(dbname, cb, name) {
		//name is optonal, if name get the details of that QA or else get the details of all QA
		if (name) {
			db[dbname].get(name, {
				revs_info: true
			}, function(err, body) {
				if (err) {
					console.log('[db.read] ', err.message);
				}
				cb(err, body);
			});
		} else {
			db[dbname].view('minlist', 'minlist', function(err, body) {
				cb(err, body);
			});
		}
	},

	update: function(dbname, name, data, cb) {
		var that = this;
		this.read(dbname, function(err, body) {
			that.create(dbname, name, _.extend(body, data), cb);
		}, name);
	},

	delete: function(dbname, cb, name, rev) {
		db[dbname].destroy(name, rev, function(err, body) {
			cb && cb(err, body);
		});
	},

	viewRead : function(dbname, cb, viewname) {
		db[dbname].view('minlist', viewname || 'minlist', function(err, body) {
			cb(err, body);
		});
	}
}




