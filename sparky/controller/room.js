/* Controller that manages a room
*
*/

var net = require('net');
var participants = []; //Array of sockets in the room
var room;

function RoomController(entity) {
  room = entity;

}

module.exports = RoomController;
