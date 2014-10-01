/*
*  Defines ServerController
*/
var net = require('net');
var SocketController = require('./socket.js');
var RoomModel = require('../model/room.js');
var RoomController = require('./room.js');

var server;
var sockets = [];
var rooms = {}; //hash of room controllers by room name

function ServerController() {
  /* Define server-wide settings */
  this.allowedFontColors = {red: true, green: true, blue: true};
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

  // Listen on port 9399
  server.listen(9399);

  console.log('Server is running. Press ctrl+c to stop.')
}
ServerController.prototype.stop = function() {
  server.close();
}

ServerController.prototype.isUserLoggedIn = function(login) {
  return this.findSocketByLogin(login) !== null;
}

ServerController.prototype.findSocketByLogin = function(login) {
  //todo (rrapp): Improve performance by keeping hash
  for(var i=0; i<sockets.length; i++) {
    if (sockets[i].currentUser !== null) {
      if (sockets[i].currentUser.login === login) {
        return sockets[i];
      }
    }
  }
  return null;
}

ServerController.prototype.findRoomByName = function(roomname) {
  //todo (rrapp): Improve performance by keeping hash
  if (rooms[roomname]) {
    return rooms[roomname];
  }
  return null;
}

ServerController.prototype.createRoom = function(roomname) {
  room = new RoomModel(roomname);
  roomController = new RoomController(room);
  rooms[roomname] = roomController;
  return roomController;
}

ServerController.prototype.getRooms = function() {
  var results = [];
  for (var i in rooms) {
    if (rooms.hasOwnProperty(i)) {
      results.push(rooms[i]);
    }
  }
  return results;
}

module.exports = ServerController;
