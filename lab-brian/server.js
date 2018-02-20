'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./lib/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE;
const pool = [];

server.on('connection', function(socket) {
  var client = new Client(socket);
  pool.push(client);
  socket.on('data', function(data) {
    const command = data.toString().split(' ').shift().trim();
    console.log(command);
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