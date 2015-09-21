'use strict';
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('config');
var consumer = {};
var transporter = nodemailer.createTransport(smtpTransport(config.get('mailer')));
consumer.name = 'email';

var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');

consumer.task = function(job, done){
    var data = job.data;
    var templateDir = path.join(__dirname, '../views/emails/', data.template);
    var letter = new EmailTemplate(templateDir);
    letter.render({username: data.to}, function (err, results) {
        transporter.sendMail({
            from: config.get('mailer.from'),
            to: data.to,
            subject: data.title,
            html: results.html

        });
    });
    done();
};

module.exports = consumer;
