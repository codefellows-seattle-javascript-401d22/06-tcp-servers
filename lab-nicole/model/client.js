'use strict';

const uuidv4 = require('uuid/v4');

module.exports = function(socket) {
  this.socket = socket;
  this.nickname = `user_${Math.floor(Math.random() * 10000)}`;
  this.id = uuidv4();
};