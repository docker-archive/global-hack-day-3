var express = require('express'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    db = require('./services/db'),
    common = require('./services/common'),
    http = require('http'),
    secrets = require('./services/configuration')
    elb = require('./services/elb');

var app = express(),
    routes = require('./routes/index');

app.set('port', process.env.PORT || 3000);
http.globalAgent.maxSockets = Infinity;

//Setting the default backend in the elb
var myIp = require('os').networkInterfaces().eth0[0].address;
elb.default(myIp + ':' + app.get('port'));

if(process.env.DOCKERBOX_INIT) {
    db.init();
}

//Redirect all non-www to www except subdomains
app.get('/*', function (req, res, next) {
    var isHttps = !!req.connection.encrypted;
    if(!secrets.config.gauth.domain) return next();
    if (secrets.config.gauth.domain && !req.headers.host.match(new RegExp('^' + secrets.config.gauth.domain))) {
        res.redirect((isHttps? 'https' : 'http') + '://' + secrets.config.gauth.domain + req.url);
    } else {
        next();
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(common.unlessMW(/^\/database/, bodyParser.json()));
app.use(common.unlessMW(/^\/database/, bodyParser.urlencoded()));
app.use(cookieParser());
app.use(session({
    secret: 'myntra dockerbox', 
    name : 'dockebox.sid',
    resave: true, 
    saveUninitialized: false,
    cookie: { 
        maxAge: 2 * 60 * 60000 // 2 hours
    }
}));
app.use(express.static(path.join(__dirname, 'public')));

routes(app); // attach all routes


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});


module.exports = app;
