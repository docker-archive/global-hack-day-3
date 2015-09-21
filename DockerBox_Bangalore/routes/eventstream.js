"use strict";

var express = require('express');
var router = express.Router();
var streamStore = require('../services/stream');

router.get('/events/:eventid', function(req, res) {
	if(!streamStore.get(req.params.eventid)) {
		res.send(200);
		return;
	}

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
    });

    var stream = streamStore.get(req.params.eventid);
        res.write("retry: 2000\n");
        res.write("data: " + 
        	JSON.stringify(stream) +
            "\n\n");
        res.end();
});

module.exports = router;