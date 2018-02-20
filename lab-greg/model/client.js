'use strict';

const uuid = require('uuid/v4');

const Client = module.exports = function(socket) {
  this.socket = socket;
  this.handle = `user_${Math.random()}`;
  this.id = uuid();
};