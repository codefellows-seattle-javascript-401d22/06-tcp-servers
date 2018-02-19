'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./model/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const pool = [];

ee.on('@all', function(client, string) {
    pool.forEach( c => {
        c.socket.write(`${client.nickname}: ${string}`);
    });
});

//not sure how this one works?? how it know
ee.on('default', function(client, string){
    client.socket.write('not a command - please use an @ symbol \n');
});

ee.on('@dm', function(client, string){
    var nickname = string.split(' ').shift().trim();
    var message = string.split(' ').splice(1).join(' ').trim();

    pool.forEach( c => {
      if(c.nickname === nickname){
          c.socket.write(`${client.nickname}: ${message}`);
      }
    });
});

ee.on('@nickname', function(client, string) {
  let nickname = string.split(' ').shift().trim();
  client.nickname = nickname;
  client.socket.write(`user nickname has been changed to ${nickname}\n`);    
});

server.on('connection', function(socket){
  var client = new Client(socket);
  pool.push(client);
//   console.log('MY POOL: ', pool)
  client.socket.write('Welcome to TCP chat!\n To create a new nickname, type the command @nickname + <your new nickname>\n To view a list of current users, type the command @list\n To quit this chat, type the command @quit \nHappy Chatting!')
  socket.on('data', function(data){
      const command = data.toString().split(' ').shift().trim();

      if(command.startsWith('@')){
        ee.emit(command, client, data.toString().split(' ').splice(1).join(' '));
        // console.log('my command after @:', data.toString().split(' ').splice(1).join(' '));
        return;
      }
      ee.emit('default', client, data.toString());
  });
}); 

ee.on('@list', function(client) {
    let list = [];
    pool.forEach( c => {
      list.push(c.nickname);
    })
    client.socket.write(`List of current users: ${list}`);
});

ee.on('@quit', function(client){
    client.socket.write('You are now disconnected\n');
    client.socket.end();
})

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});