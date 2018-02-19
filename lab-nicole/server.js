'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const clientPool = [];

ee.on('@help', function(client) {
  client.socket.write('List of Commands\n@me to see your current nickname\n@all - to chat with everyone who is connected\n@nickname - to change your nickname\n@dm - to send a private message to a person by nickname\n@list - to list all people in chat\n@quit - to exit chat\n');
});

ee.on('@all', function(client, string) {
  clientPool.forEach(c => {
    c.socket.write(`${client.nickname}: ${string}\n`);
  });
});

ee.on('@me', function(client) {
  client.socket.write(`Your nickname is currently ${client.nickname}`);
});

ee.on('@nickname', function(client, string) {
  let nickname = string.split(' ').shift().trim();
  client.nickname = nickname;
  client.socket.write(`user nickname has been changed to ${nickname}\n`);
});

ee.on('default', function(client) {
  client.socket.write('not a command, please start command with @\n');
});

ee.on('@dm', function(client, string) {
  var nickname = string.split(' ').shift().trim();
  var message = string.split(' ').splice(1).join(' ');
  clientPool.forEach(c => {
    if (c.nickname === nickname) {
      c.socket.write(`${client.nickname}: ${message}\n`);
    }
  });
});

ee.on('close', function(client) {
  let index = undefined;
  for(let i in clientPool) {
    if(client.nickname === clientPool[i].nickname) {
      index = i;
    }
  }
  client.socket.write(`${clientPool[index].nickname}'s connection will be closed.\n`);
  clientPool.splice(index, index+1);
  client.socket.write('Your connection was closed.\n');
});

ee.on('@quit', function(client) {
  ee.emit('close', client);
  client.socket.destroy();
});

ee.on('error', function(error) {
  throw new Error('this is your error', error);
});

// this function is for testing purposes
ee.on('@error', function() {
  ee.emit('error');
});

ee.on('@list', function(client) {
  clientPool.forEach(c => {
    client.socket.write(`${c.nickname}\n`);
  });
});

server.on('connection', function(socket) {
  var client = new Client(socket);
  clientPool.push(client);

  socket.on('data', function(data) {
    const command = data.toString().split(' ').shift().trim();
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