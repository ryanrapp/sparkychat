/* Controller that manages the connection
*  with the client.
*
*  Wraps socket.
*/

var net = require('net');
var UserModel = require('../model/user.js');

var socket;
var serverController;

function SocketController(parent, new_socket) {
  socket = new_socket;
  serverController = parent;
  socket.on('data', function(data) {
    _receiveData(data);
  });
  socket.on('end', function() {
    serverController.closeSocket(socket);
  });
  this.currentUser = null;

  socket.write('Welcome to the XYZ chat server');
}

/*
 * Cleans the input of carriage return, newline
 */
function _cleanInput(data) {
  return data.toString().replace(/(\r\n|\n|\r)/gm,"");
}

function _loginUser(login) {
  if (!UserModel.prototype.validateLogin(login)) {
    socket.write('Invalid Login Name.');
    return;
  }
  if (serverController.isUserLoggedIn(login)) {
    socket.write('Sorry, name taken.');
    return;
  }
  this.currentUser = new UserModel(login);
  socket.write('Welcome ' + this.currentUser.login + '!');
}

/*
 * Method executed when data is received from a socket
 */
function _receiveData(data) {
  var cleanData = _cleanInput(data);
  if(cleanData === "@quit") {
    socket.end('Goodbye!\n');
  }
  if (!this.currentUser) {
    return _loginUser(cleanData);
  }
  // else {
  //   for(var i = 0; i<sockets.length; i++) {
  //     if (sockets[i] !== socket) {
  //       sockets[i].write(data);
  //     }
  //   }
  // }
}

/*
*  Pass through certain functions to the socket
*/
SocketController.prototype.write = function() {
  socket.write.apply(socket, arguments);
}
SocketController.prototype.on = function() {
  socket.on.apply(socket, arguments);
}
SocketController.prototype.end = function() {
  socket.end.apply(socket, arguments);
}

module.exports = SocketController;
