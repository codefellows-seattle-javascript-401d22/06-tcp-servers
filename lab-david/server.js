'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./lib/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();
const clientPool = [];

ee.on('default', function(client, string){
  client.socket.write(`${string} is not an accepted command - type "@help" for a list of supported commands\n`);
});

ee.on('@help', function(client){
  client.socket.write(`@all <message> - sends a message to all active users\n
  @dm <nickname> <message> - send a message to the user with the associated nickname\n
  @list - printout all active users\n
  @nickname <newnickname> - change your nickname to the newnickname\n`);
});

ee.on('@all', function(client, string){
  clientPool.forEach(c => {
    c.socket.write(`${client.nickname}: ${string}`);
  });
});

ee.on(`@dm`, function(client, string){
  var namefound = false;
  var nickname = string.split(' ').shift().trim();
  var msg = string.split(' ').splice(1).join(' ').trim();
  clientPool.forEach(c => {
    if(c.nickname === nickname){
      c.socket.wriote(`${client.nickname}: ${msg}`);
      namefound = true;
      return;
    }
  });
  if(!namefound){
    client.socket.write('that nickname was not found');
  }
});


server.on('connection', function(socket){
  var client = new Client(socket);
  clientPool.push(client);

  socket.on('data', function(data){
    const command = data.toString().split(' ').shift().trim();

    if(command.startsWith('@')){
      ee.emit(command, client, data.toString().split(' ').splice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());
  });
});

server.listen(PORT, () => console.log(`listening on ${PORT}`));