var express = require('express');
var router = express.Router();
var ode = require('../lib/dockerode_wrapper');

/* GET home page. */
router.get('/', function(req, res, next) {
  ode.listContainers(function(error, containers){
    if (error != null) {
      res.render('index', { title: 'WhaleScope', data: data, });
    } else {
      res.status(error || 404);
      res.render('error', {
        message: error,
        error: {}
      });
    }
  });
});

/* GET container page. */
router.get('/container', function(req, res, next) {
  ode.listContainers(function(error, container_data){
    if (error != null) {
      res.render('container', { title: 'WhaleScope', data: container_data, charts: JSON.stringify(chart)});
    } else {
      res.status(error || 404);
      res.render('error', {
        message: error,
        error: {}
      });
    }
  });
});

module.exports = router;
