# Terminal Chat

Terminal Chat is a simple TCP chatroom that allows you to chat with connected users with a few, easy steps.

### Connecting 

To connect to the TCP server, you will need to use the telnet command in your terminal. If you don't have this command, you 
can in install it with the command `brew install telnet`. You will need to obtain the IP address of the server from the server
owner, and then run command `telnet <IP address> 3000` e.g. `telnet 100.100.100.100 3000`. Upon succesful connection, you should
recieve a welcome message.

### Commands

Once you are successfully logged in, there are a number of commands you can run from your command line --

  - `@all <message>` -- sends message to all connected users
  - `@dm <nickname> <message>` -- sends message to current user with specified nickname
  - `@gm <nickname> <nickname> ... : <message>` -- sends messages to users specified before the colon 
  - `@nickname <nickname>` -- changes your nickname to specified nickname 
  - `@list` -- returns list of current users
  - `@quit` -- disconnects current user
  - `@help` -- lists commands 
