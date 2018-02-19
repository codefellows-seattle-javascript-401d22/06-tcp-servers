'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const clientPool = [];

// Send message to all connected users
ee.on('@all', function(client, string) {
  clientPool.forEach( c => {
    c.socket.write(`${client.nickname}: ${string}`)
  })
})

// Send dm to a specific connected user
ee.on('@dm', function(client, string) {
  var nickname = string.split(' ').shift().trim();
  var message = string.split(' ').splice(1).join(' ').trim();
  clientPool.forEach( c => {
    if (c.nickname === nickname) {
      c.socket.write(`${nickname}: ${message}`)
    }
  })
})

// Set new user nickname
ee.on('@nickname', function(client, string) {
  let newNickname = string.split(' ').shift().trim();
  client.nickname = newNickname;
  client.socket.write(`Nickname has been changed to ${client.nickname}\n`)
})

// List all connected users
ee.on('@list', function(client, string) {
  console.log(client.nickname)
  clientPool.forEach( c => {
    client.socket.write(`connected user: ${client.nickname}\n`)
  })
})

// Disconnect user
ee.on('@quit', function(client) {
  client.socket.end();
})

// Helper 
ee.on('@help', function(client, string) {
  client.socket.write(
    `\n
    @all - send message to all connected users\n
    @dm <username> - send message to specific user\n
    @nickname - set new nickname\n
    @list - list all connected users\n
    @quit - disconnects user\n\r
    `)
})

ee.on('default', function(client, string) {
  client.socket.write('not a command - please start with @\n')
})

server.on('connection', function(socket) {
  var client = new Client(socket);
  clientPool.push(client);
  console.log(`Client connected: ${client.nickname}`)

  socket.on('close', function() {
    console.log(`Client disconnected: ${client.nickname}`)
    var idx = clientPool.indexOf(client)
    clientPool.splice(idx, 1);
  })
  
  socket.on('data', function(data) {
    const command = data.toString().split(' ').shift().trim();
    if (command.startsWith('@')) {
      ee.emit(command, client, data.toString().split(' ').splice(1).join(' '))
      console.log(client.nickname, command, data.toString().split(' ').splice(1).join(' '));
      return;
    }
    ee.emit('default', client, data.toString());
  });
});

server.on('error', (err) => {
  throw err;
});

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})