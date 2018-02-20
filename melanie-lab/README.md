![cf](https://i.imgur.com/7v5ASc8.png) Lab 06: TCP Chat Server
======

## Directory Structure
* **README.md**
* **.gitignore**
* **.eslintrc**
* **.eslintignore**
* **package.json**
  * a `lint` script has been configured for running eslint
  * a `test` script has been configured for running jest (note: there are currently no tests for this application)
  * a `start` script has been configured for running the server
* **model/** - contains module definitions
  * **client.js** - contains Client constructor that models an individual connectio
* **server.js** - contains server configuration for TCP chat application

## Installation
1. To install this TCP chat server, download the files from this repository
2. `cd` to the repository directory and run `npm i`
3. Use `npm run start` or `node server.js` to start the server connection
4. Once the server is running, users can access the chatroom application by entering `telnet <server ip address> <server port>`

## Client Commands
Within the chat application, users can use the following commands:
* `@all` - send message to all connected users
* `@dm <username>` - send direct message to specific user
* `@nickname` - set new nickname
* `@list` - list all connected users
* `@quit` - disconnect user
* `@help` - list all available commands