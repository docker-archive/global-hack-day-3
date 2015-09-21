'use strict';
var crypto = require('crypto');
var SaltLength = 16;

function generateSalt(len) {
  var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
      setLen = set.length,
      salt = '';
  for (var i = 0; i < len; i++) {
      var p = Math.floor(Math.random() * setLen);
      salt += set[p];
  }
  return salt;
}

function md5(string) {
  return crypto.createHash('sha512').update(string).digest('base64');
}

function createHash(password) {
  var salt = generateSalt(SaltLength);
  var hash = md5(password + salt);
  return {salt: salt, password: hash};
}

function validateHash(hash, password, salt) {
  var validHash = md5(password + salt);
  return hash === validHash;
}


module.exports = {
  'hash': createHash,
  'validate': validateHash
};
