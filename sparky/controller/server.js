/*
*  Defines ServerController
*/
var net = require('net');
var SocketController = require('./socket.js');

var server;
var sockets = [];


function ServerController() {
  /*no public variables*/
}

/*
 * Callback method executed when a new TCP socket is opened.
 */
function _newSocket(new_socket) {
  var socket = new SocketController(this.serverController, new_socket);
  sockets.push(socket);
}

/*
 * Method executed when a socket ends
 */
ServerController.prototype.closeSocket = function(socket) {
  var i = sockets.indexOf(socket);
  if (i != -1) {
    sockets.splice(i, 1);
  }
}

ServerController.prototype.start = function() {
  // Create a new server and provide a callback
  // for when a connection occurs
  server = net.createServer(_newSocket);
  server.serverController = this;

  // Listen on port 8888
  server.listen(8888);
}
ServerController.prototype.stop = function() {
  server.close();
}

ServerController.prototype.isUserLoggedIn = function(login) {
  //todo (rrapp): Improve performance by keeping hash
  for(var i=0; i<sockets.length; i++) {
    if (sockets[i].currentUser !== null) {
      if (sockets[i].currentUser.login === login) {
        return true;
      }
    }
  }
  return false;
}

module.exports = ServerController;
