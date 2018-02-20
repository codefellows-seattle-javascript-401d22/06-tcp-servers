'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const userPool = [];

ee.on('@group', function(client, string) {
  userPool.forEach( c => {
    c.socket.write(`${client.nickname}: ${string}`);
  });
});

ee.on('@handle', function(client, string) {
  let handle = string.split(' ').shift().trim();
  client.handle = handle;
  client.socket.write(`Your new handle is ${handle}\n`);
});

server.on('connection', function(socket) {
  var client = new Client(socket);
  userPool.push(client);

  socket.on('data', function(data){
    const command = data.toString().split(' ').shift().trim();
    if (command.startsWith('@')) {
      ee.emit(command, client, data.toString().split(' ').splice(1).join(' '));
      return;
    }
  });
});






server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});