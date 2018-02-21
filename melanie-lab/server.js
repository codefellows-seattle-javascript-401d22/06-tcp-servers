'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client.js');
const PORT = process.env.PORT || 3000;
// calls the create server function, gives us access to methods and properties on server object
const server = net.createServer();
// pull in events module, instantiate new events object - can now create & fire our own events
const ee = new EE();

const pool = [];

// Send message to all connected users
ee.on('@all', function(client, string) {
  pool.forEach( c => {
    c.socket.write(`${client.nickname}: ${string}`);
  });
});

// Send dm to a specific connected user
ee.on('@dm', function(client, string) {
  var nickname = string.split(' ').shift().trim();
  var message = string.split(' ').splice(1).join(' ').trim();
  pool.forEach( c => {
    if (c.nickname === nickname) {
      c.socket.write(`DM from ${client.nickname}: ${message}\n`);
    }
  });
});

// Set new user nickname
ee.on('@nickname', function(client, string) {
  let nickname = string.split(' ').shift().trim();
  client.nickname = nickname;
  client.socket.write(`Nickname has been changed to ${client.nickname}\n`);
});

// List all connected users
ee.on('@list', function(client) {
  pool.forEach( c => {
    client.socket.write(`connected user: ${c.nickname}\n`);
  });
});

// Disconnect user
ee.on('@quit', function(client) {
  client.socket.end();
});

// Helper 
ee.on('@help', function(client) {
  client.socket.write(
    `\r
    @all - send message to all connected users\n
    @dm <username> - send message to specific user\n
    @nickname - set new nickname\n
    @list - list all connected users\n
    @quit - disconnects user\n\r\n`
  );
});

ee.on('default', function(client) {
  client.socket.write('not a command - please start with @\n');
});

server.on('connection', function(socket) {
  var client = new Client(socket);
  pool.push(client);
  console.log(`Client connected: ${client.nickname}`);

  socket.on('close', function() {
    console.log(`Client disconnected: ${client.nickname}`);
    var idx = pool.indexOf(client);
    pool.splice(idx, 1);
  });
  
  socket.on('data', function(data) {
    const command = data.toString().split(' ').shift().trim();
    if (command.startsWith('@')) {
      ee.emit(command, client, data.toString().split(' ').splice(1).join(' '));
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
  console.log(`Listening on ${PORT}`);
});