'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const clientPool = [];

ee.on('@all', function(client, string) {
  clientPool.forEach( c=> {
    c.socket.write(`${client.nickname}: ${string}`);
  })
})

ee.on('@nickname', function(client, string) {
  let nickname = string.split(' ').shift().trim();
  client.nickname = nickname;
  client.socket.write(`user nickname has been changed to ${nickname}`);
})

ee.on('default', function(client, string) {
  client.socket.write('Not a command - please use an @ symbol \n');
})

server.on('connection', function(socket) {
  var client = new Client(socket);
  clientPool.push(client);

  socket.on('data', function(data) {
    const command = data.toString().split(' ').shift().trim();

    if (command.startsWith('@')) {
      ee.emit(command, client, data.toString().split(' ').splice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());
  });
})

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
});