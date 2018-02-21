'use strict';

const net = require('net');
const EE = require('events');
const Client = require('./lib/client.js');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

const pool = [];

ee.on('@all', function(client, string) {
    pool.forEach( c => {
        c.socket.write(`${client.nickname}: ${string}`);
    });
});

ee.on('@gm', function(client, string) {
    var names = string.split(':')[0].split(' ');
    var message = string.split(':')[1];
    
    
    for(var i = 0; i < pool.length; i++){
        for(var j = 0; j < names.length; j++) {
            if(pool[i].nickname === names[j]){
                pool[i].socket.write(`${client.nickname}: ${message}\n`);
                break;
            }
        }
    }
});
    
    
ee.on('@dm', function(client, string) {
    var nickname = string.split(' ').shift().trim();
    var message = string.split(' ').splice(1).join(' ').trim();

    pool.forEach( c => {
        if(c.nickname === nickname) {
            c.socket.write(`${client.nickname}: ${message}\n`);
        }
    });
});

ee.on('@nickname', function(client, string) {
    let nickname = string.split(' ').shift().trim();
    let taken = false;
    pool.forEach( c => {
        if(c.nickname === nickname) {
            taken = true;
            client.socket.write(`That nickname is already taken, please try another...\n`);
            return;
        }
    });
    if(taken === false) {
        client.nickname = nickname;
        client.socket.write(`user nickname has been changed to ${nickname}\n`);
    }
});

        
            


ee.on('@list', function(client) {
    client.socket.write(`Connected users--\n`);
    pool.forEach( c => {
        client.socket.write(`User: ${c.nickname}\n`);
    });
});

ee.on('@quit', function(client) {
    client.socket.write(`You are now disconnected, ${client.nickname}`);
    client.socket.end();
  });

ee.on('@help', function(client) {
    client.socket.write(`
    
    @all <message> -- sends message to all connected users\n
    @dm <nickname> <message> -- sends message to current user with specified nickname\n
    @gm <nickname> <nickname> ... : <message> -- sends messages to users specified before the colon \n 
    @nickname <nickname> -- changes your nickname to specified nickname \n
    @list -- returns list of current users\n
    @quit -- disconnects current user\r\n
    `);
});

ee.on('default', function(client) {
    client.socket.write('not a command - please use an @ symbol \n');
});


server.on('connection', function(socket) {
    var client = new Client(socket);
    pool.push(client);
    client.socket.write(``);
    
    socket.on('data', function(data) {
        const command = data.toString().split(' ').shift().trim();
        
        if(command.startsWith('@')) {
            ee.emit(command, client, data.toString().split(' ').splice(1).join(' '));
            console.log('my command after at', data.toString().split(' ').splice(1).join(' '));
            return;
        }

        ee.emit('default', client, data.toString());
    });
    
    socket.on('close', function() {
        var idx = pool.indexOf(client);
        pool.splice(idx, 1);
    });

    socket.on('error', function(err) {
        console.log(err);
    });
});
    
server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});

    




    


