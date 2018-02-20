'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const clientPool = [];


ee.on('@help', function(client, string) {
  clientPool.forEach( c => {
    c.socket.write(`${client.nickname}: Here are all the commands. \n @all: Sends a message to all users in the server. \n @dm: send a direct message to a specific user (must use correct nickname) \n @nickname: change your username on the server! \n @list: lists all users on the server. \n @quit: disconnects you from the server.`)
  })
})

ee.on('@list', function(client) {
  clientPool.forEach( c => {
    client.socket.write(`User: ${c.nickname}\n`);
  })
})

ee.on('@dm', function(client, string) {
  var nickname = string.split(' ').shift().trim();
  var message = string.split(' ').splice(1).join(' ').trim();
  
  clientPool.forEach( c => {
    if (c.nickname === nickname) {
      client.socket.write(`${client.nickname}: ${message}`)
    };
  });
});

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

ee.on('@quit', function(client) {
  client.socket.end();
  console.log('disconnected');
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

server.on('error', (err) => {
  throw err;
})

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
});