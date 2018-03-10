'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const userPool = [];

ee.on('default', function(client) {
  client.socket.write('not a command, please use an @ sign \n');
});

ee.on('@group', function(client, string) {
  userPool.forEach( c => {
    c.socket.write(`${client.handle}: ${string}`);
  });
});



ee.on('@handle', function(client, string) {
  let handle = string.split(' ').shift().trim();
  client.handle = handle;
  client.socket.write(`Your new handle is ${handle}\n`);
});

ee.on('@im', function(client, string) {
  var handle = string.split(' ').shift().trim();
  var message = string.split(' ').splice(1).join(' ').trim();
  userPool.forEach( c => {
    if(c.handle === handle) {
      c.socket.write(`${client.handle}: ${message}`);
    }
  });
});

ee.on('@list', function(client) {
  userPool.forEach(c => {
    client.socket.write(c.handle);
  });
});

ee.on('@quit', function(client){
  userPool.forEach(c => {
    userPool.pop(c);
  });
  client.socket.end();
});

server.on('connection', function(socket) {
  var client = new Client(socket);
  userPool.push(client);
  

  socket.on('data', function(data){
    const command = data.toString().split(' ').shift().trim();
    console.log(command);
    if (command.startsWith('@')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }
    ee.emit('default', client, data.toString());
  
  });
});






server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});