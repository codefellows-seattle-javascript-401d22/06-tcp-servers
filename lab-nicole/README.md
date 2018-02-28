### TCP Server Chatroom

#### About This Program

This program uses a TCP server to create a chatroom in which users can everyone in the chat or an individual person.

#### Instructions for Starting Server

First, find your ip address. If you don't already have the get-ip node package installed, I would suggest doing that. From your terminal:
```
npm i -g get-ip
```
Then, to grab your IP address, type:

```
get-ip
```
In order to start the server connection, open your terminal and write the following command:
```
npm run start
```
Or you can use the command
```
node server.js
```
This will open the connection so that others can join your chatroom. 

#### Joining the Chatroom

In order to join the chatroom, open your terminal and type the following command:
``` 
telnet (IP address of server) (PORT)
```
With the IP address and port being supplied by your server.

#### Using the Chatroom

When you join the chatroom, you will be given a default username. 
- In order to find that username, type __@me__. Other people connected to this chatroom will be able to direct message you using this nickname.
- To change your nickname, type __@nickname__ followed by the name you would like to be changed to. 
- To list all users in chat, type __@list__.
- To direct message another user in the chat, type __@dm__ (nickname) (your message).
- To message all the people in the channel, type __@all__ (your message).
- To see a list of all commands, type __@help__.
- To exit out of the chatroom, type __@quit__.

