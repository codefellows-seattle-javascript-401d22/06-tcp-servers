'use strict';

const uuidv4 = require('uuid/vd');

const Client = module.exports = function(socket){
  this.socket = socket;
  this.nickname = `user_${Math.random()}`;
  this.id = uuidv4();
};