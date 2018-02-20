'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./lib/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE;
const pool = [];

ee.on('default', function(client, string) {
  string = string.trim();
  client.socket.write(`${string} is not a command please use at symbol\n`);
});

ee.on('@all', function(client, string) {
  pool.forEach(c => {
    c.socket.write(`${client.nickname}: ${string}`);
  });
});

ee.on('@dm', function(client, string) {
  var nickname = string.split(' ').shift().trim();
  var message = string.split(' ').splice(1).join(' ').trim();

  pool.forEach(c => {
    if(c.nickname === client.nickname) {
      c.socket.write(`${client.nickname}: ${string}`);
    }
  });
});

ee.on('@nickname', function(client, string) {
  let nickname = string.split(' ').shift().trim();
  client.nickname = nickname;
  client.socket.write(`user nickname has been changed to ${nickname}\n`);
});

server.on('connection', function(socket) {
  var client = new Client(socket);
  pool.push(client);
  socket.on('data', function(data) {
    const command = data.toString().split(' ').shift().trim();
    // console.log(command);
    if(command.startsWith('@')) {
      ee.emit(command, client, data.toString().split(' ').splice(1).join(' '));
      return;
    }
    ee.emit('default', client, data.toString());
  });
});


server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});