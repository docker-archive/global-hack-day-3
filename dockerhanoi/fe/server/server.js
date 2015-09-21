'use strict';

var config = require('config');
var express = require('express');
var db = require('./models');
var fs = require('fs');
var yaml = require('js-yaml');
var bodyParser = require('body-parser');
var app = express();

// set views
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// add-on swagger-ui
app.use('/swagger', express.static('./node_modules/swagger-ui/dist'));

// redirect page
app.use('/', express.static('./server/docs'));

// body parse
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// api-json swagger
app.get('/docs', function(req, res){
    var docs = yaml.safeLoad(fs.readFileSync('./server/docs/swagger.yml', 'utf8'));
    res.send(JSON.stringify(docs));
});

// add modification header
app.use(function(req, res, next){
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// websocket 
var expressWs = require('express-ws');
expressWs(app);

// auth
app.use(require('./middlewares/users'));
app.use(require('./apis'));
app.ws('/api/v1/logs', require('./websockets/logs'));

// Start web server at port 3000
db.sequelize.sync().then(function () {
    var port = config.get('server.port');
    var server = app.listen(port, function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log('Server start at http://%s:%s', host, port);
    });
});

