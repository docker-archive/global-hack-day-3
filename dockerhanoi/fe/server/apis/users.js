'use strict';
var express = require('express'), 
    config = require('config'),
    router = express.Router(), 
    crypto = require('crypto'),
    db = require('../models'),
    request = require('request'),
    pass = require('../helpers/password.js');

// list users
router.get('/list/:page/:limit', function(req, res){
    var limit = (req.params.limit)? req.params.limit: 10;
    var offset = (req.params.page)? limit * (req.params.page - 1): 0;
    db.User.findAndCountAll({
        include: [],
        limit: limit,
        offset: offset

    }).then(function(users) {
        res.send(JSON.stringify(users));
    });
});

// new user
router.post('/github', function(req, res){
    req.body.client_secret = config.get('github.client_secret');
    request.post({url: req.body.request_url, form: req.body, json: true}, function(err,httpResponse,body){ 
        res.send(JSON.stringify(body));
    });
});
// new user
router.post('/create', function(req, res){
    var hash = pass.hash(req.body.password);
    db.User.create({
        username: req.body.username,
        password: hash.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        salt: hash.salt
    }).then(function(user){
        crypto.randomBytes(64, function(ex, buf) {
            var token = buf.toString('base64').replace(/\//g,'_').replace(/\+/g,'-');
            var now = new Date();
            db.Token.create({
                UserId: user.id,
                token: token,
                expiredAt: now
            }).then(function(t){
                user.dataValues.token = t.token;
                var q = require('../queues');
                q.create('email', {
                    title: '[Site Admin] Welcome Email',
                    to: user.username,
                    template: 'welcome'
                }).priority('high').save();
                res.send(JSON.stringify(user));
            });
        });
    }).catch(function(e){
        res.status(500).send(JSON.stringify(e));
    });

});

// delete user
router.delete('/:id', function(req, res){
    res.send(JSON.stringify({}));
});

// user detail
router.get('/view/:id', function(req, res){
    db.User.findOne({
        where: {
            id: req.params.id
        }
    }).then(function(user){
        res.send(JSON.stringify(user));
    }).catch(function(e){
        res.status(500).send(JSON.stringify(e));
    });
});

// update user
router.put('/update/:id', function(req, res){
    db.User.find({ 
        where: {
            id: req.params.id
        } 
    }).then(function(user) {
        if (user) {
            user.updateAttributes({
                firstname: req.body.firstname,
                lastname: req.body.lastname
            }).then(function() {
                res.send(JSON.stringify(user));
            });
        }
    }).catch(function(e){
        res.status(500).send(JSON.stringify(e));
    });
});

// login
router.post('/login', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    db.User.findOne({
        where: {
            username: username
        }
    }).then(function(user){
        if (!pass.validate(user.password, password, user.salt)){
            res.status(401).send(JSON.stringify({}));
        }
        db.Token.findOne({
            where: {
                UserId: user.id
            }
        }).then(function(t){
            if (!t.token){
                crypto.randomBytes(64, function(ex, buf) {
                    var token = buf.toString('base64');
                    var now = new Date();
                    db.Token.create({
                        UserId: user.id,
                        token: token,
                        expiredAt: now
                    }).then(function(to){
                        user.dataValues.token = to.token;
                        res.send(JSON.stringify(user));
                    });
                });
            }
            res.send(JSON.stringify({
                token: t.token,
                id: user.id
            }));
        });
    }).catch(function(e){
        res.status(401).send(JSON.stringify(e));
    });
});

module.exports = router;
