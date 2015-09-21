'use strict';
var express = require('express'), 
    router = express.Router(), 
    config = require('config'),
    db = require('../models');

// new deployments
router.post('/create', function(req, res){
    var logFile = '';
    db.Deploy.create({
        AppId: req.body.appId,
        deployStatus: req.body.deployStatus,
        logFile: logFile,
        deployUrl: req.body.deployUrl,
        gitUrl: req.body.gitUrl,
        htmlUrl: req.body.htmlUrl,
        dockerFile: req.body.dockerFile,
        dockerCompose: req.body.dockerCompose,
	awsAccessKeyId: req.body.awsAccessKeyId,
	awsSecretAccessKey: req.body.awsSecretAccessKey,
	awsVpcId: req.body.awsVpcId,
	awsRegion: req.body.awsRegion,
	awsSubnetId: req.body.awsSubnetId
    }).then(function(deploy){
        var fs = require('fs');
        var path = require('path');
        var logFile = path.join(config.get('logs'), deploy.AppId.toString(), deploy.id.toString() + '.log');

        deploy.updateAttributes({
            logFile: logFile
        }).then(function() {
            fs.writeFile(logFile, '', function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log('The file was saved!');
            });
            res.send(JSON.stringify(deploy));
        });
    }).catch(function(e){
        console.log(e);
        res.status(500).send(JSON.stringify(e));
    });

});

// list deployments
router.get('/list/:AppId/:page/:limit', function(req, res){
    var limit = (req.params.limit)? req.params.limit: 10;
    var offset = (req.params.page)? limit * (req.params.page - 1): 0;
    var AppId = req.params.AppId;
    db.Deploy.findAndCountAll({
        include: [],
        where:{
            AppId: AppId
        },
        order: 'id DESC',
        limit: limit,
        offset: offset

    }).then(function(deploys) {
        res.send(JSON.stringify(deploys));
    });
});

// deploy detail
router.get('/view/:id', function(req, res){
    db.Deploy.findOne({
        where: {
            id: req.params.id
        }
    }).then(function(deploy){
        res.send(JSON.stringify(deploy));
    }).catch(function(e){
        res.status(500).send(JSON.stringify(e));
    });
});

// update deploy
router.put('/update/:id', function(req, res){
    db.Deploy.find({ 
        where: {
            id: req.params.id
        } 
    }).then(function(deploy) {
        if (deploy) {
            deploy.updateAttributes({
                deployStatus: req.body.deployStatus
            }).then(function(d) {
                res.send(JSON.stringify(d));
            });
        }
    }).catch(function(e){
        res.status(500).send(JSON.stringify(e));
    });
});

module.exports = router;
