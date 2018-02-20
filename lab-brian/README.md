## Directory Structure

* **README.md** - contains documentation
* **.gitignore** - contains a robust `.gitignore` file 
* **.eslintrc.json** - contains the linter configuratoin
* **.eslintignore** - contains the linter ignore configuration
* **package.json** - contains npm package config
  * contains a `lint` script for running eslint
  * contains a `start` script for running your server
  * contains a `test` script for running Jest
* **lib/** - contains module definitions

## Feature Tasks  
For this assignment, you will be building a TCP chatroom. Clients should be able to connect to the chatroom through the use of telnet. Clients should also be able to run special commands to exit the chatroom, list all users, reset their nickname, and send direct messages. You may add as many features to this application as you would like. Do not use any third party libraries and testing is *not* required.

##### Commands
* @all: message all users
* @dm [username]: direct message a user
* @quit: logout
* @list: list all users logged on
* @nickname: change your nickname
* @help: show command options
