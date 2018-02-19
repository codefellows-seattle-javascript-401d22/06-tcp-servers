'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./lib/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();
const clientPool = [];

ee.on('default', function(client){
  client.socket.write('not an accepted command - type "@help" for a list of supported commands\n');
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

    ee.emit('default', client, data.toString())
  })
})

server.listen(PORT, () => console.log(`listening on ${PORT}`));