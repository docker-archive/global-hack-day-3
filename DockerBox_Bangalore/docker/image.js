//Expecting the registry as dependency from docker-compose


var exec = require('child_process').exec,
	spawn = require('child_process').spawn,
	fs = require('fs'),
	tempFolder = __dirname + '/tempfiles/dockerfiles/',
	secrets = require('../services/configuration'),
	async = require('async');

module.exports = {
	create : function(name, dockerfileString, stream, cb) {
		var registryHost = getRegistryHost() || '$DOCKER_HOST';
		var that = this;
		//create a folder for the dockerfile
		exec('mkdir -p '+ tempFolder + name, function(err, stdout, stderr) {
			if(err||stdout||stderr) console.log(err, stdout, stderr);
			if(err) return;
	    
	    	fs.writeFileSync(tempFolder + name + '/Dockerfile', dockerfileString);
	    	var build = spawn('docker', ['-H', registryHost, 'build', '-t', name, tempFolder + name]);	

			build.stdout.on('data', function(data) { 
				stream.data += (data ? data.toString('utf8') : '');
				//console.log(data ? data.toString('utf8') : ''); 
			});
			build.stdout.on('end', function(data) {
				stream.data += (data ? data.toString('utf8') : '');
				//console.log(data ? data.toString('utf8') : '');
			});
			build.on('exit', function(code) {
				stream.data += ('Docker Build completed with Exit Code: ' + code);
				//console.log('Docker Build completed with Exit Code: ' + code);
				if(code === 0) that.push(name, stream, cb);
				else cb(code);
			});
		});
	},

	push : function(name, stream, cb) { // push to registry
		var registryHost = getRegistryHost() || '$DOCKER_HOST';
		var registry = secrets.GLOBAL.registry;
		registry = registry ? registry+'/' : '';

		if(!registry) {
			stream.data += '\nPush to registry cancelled since no registry configured.'
			return cb(0);
		}

		//Retag the image for your local repoistory
		var command = 'docker';
	    command += ' -H ' + registryHost; 	
		exec(command + ' tag ' + name + ':latest ' + registry + name + ':latest', function(err, stdout, stderr) {
			if(err||stdout||stderr) console.log(err, stdout, stderr);
			if(err) return;

			var push = spawn('docker', ['-H', registryHost, 'push', registry + name + ':latest']);	

			push.stdout.on('data', function(data) { 
				stream.data += (data ? data.toString('utf8') : '');
				//console.log(data ? data.toString('utf8') : ''); 
			});
			push.stdout.on('end', function(data) {
				stream.data += (data ? data.toString('utf8') : '');
				//console.log(data ? data.toString('utf8') : '');
			});
			push.on('exit', function(code) {
				stream.data += ('Docker Push completed with Exit Code: ' + code);
				//console.log('Docker Build completed with Exit Code: ' + code);
				cb(code);
			});
		});
	},
	
	remove : function(name, cb, imageHost) {
		var registryHost = getRegistryHost() || '$DOCKER_HOST';
		var self = this;
		var command = 'docker';
	    command += ' -H ' + (imageHost || registryHost); 

	    async.parallel([deleteLocalImage, deleteRegistryImage], function(err, result){
	    	cb(err);
	    });

	    function deleteLocalImage(cb) {
	    	checkNdelete(name, cb);
	    }
		
		function deleteRegistryImage(cb) {
	    	var registry = secrets.GLOBAL.registry;
			registry = registry ? registry+'/' : '';
	    	checkNdelete(registry + name, cb);
	    }

	    function checkNdelete(name, cb) {
	    	async.waterfall([
		    	function(cb){
		    		checkImageExist(name, cb);
		    	},function(exist , cb){
		    		if(exist) deleteImage(name, cb);
		    		else cb(null)
		    	}], function(err, result){
		    	cb(err);
		    });	
	    }

	    function deleteImage(name, cb) {
	    	exec(command + ' rmi ' + name, function(err, stdout, stderr) {
				if(err||stdout||stderr) console.log(err, stdout, stderr);
				cb && cb(err);
			});
	    }

	    function checkImageExist(name, cb) {
	    	self.listImages(function(err, taglist){
	    		cb(err, !(taglist.indexOf(name) === -1));
	    	}, imageHost);
	    }
	},

	listImages : function(cb, imageHost) {
		var registryHost = getRegistryHost() || '$DOCKER_HOST';
		var command = "docker";
		command += ' -H ' + (imageHost || registryHost);
		command += " images | awk '{print $1}'";
		exec(command, function(err, stdout, stderr){
			if(err) return cb(err);
			var taglist = stdout.split(/\n/).filter(function(a){return !!a && a != 'latest' && a != 'TAG'});
			taglist.splice(0,1); // removing the string Repository
			cb(err, taglist);
		});
	}
}


//Utils

function getRegistryHost () {
	if(secrets.config.cluster.master.internal_ip) return 'tcp://' + secrets.config.cluster.master.internal_ip + ':2375';
	return null;
}