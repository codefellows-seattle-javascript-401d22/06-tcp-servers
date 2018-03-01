## TCP Server

##### This application is a TCP chat server, with multiple commands at your disposal. 

* `@help` will return a list of all available commands.

* `@list` will return a list of all users on the server.

* `@quit` will disconnect you from the server. 

* `@nickname <name>` will change your nickname on the server.

* `@dm <nickname> <message>` will send a direct message to the specified nickname. 

* `@all <message>` will send a message to the whole server. 

* If you try to send a message to the server without `@all`, you will recieve this message: "Not a command - please use an @ symbol"
