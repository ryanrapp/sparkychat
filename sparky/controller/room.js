/* Controller that manages a room
*
*/

var net = require('net');
var TextView = require('../view/text.js');
var MessageView = require('../view/message.js');
var SystemMessageView = require('../view/systemmessage.js');
var UserView = require('../view/user.js');

function RoomController(entity) {
  this.participants = []; //Array of sockets in the room
  this.room = entity;
}

RoomController.prototype.addParticipant = function(socketEntity) {
  var systemMessageView = new SystemMessageView(
      'new user joined ' + this.getName() + ': ', true);
  var userView = new UserView(socketEntity.currentUser);

  this.transmit([systemMessageView, userView]);

  this.participants.push(socketEntity);
}

RoomController.prototype.getParticipantCount = function() {
  return this.participants.length;
}

RoomController.prototype.removeParticipant = function(socketEntity) {
  var systemMessageView = new SystemMessageView(
      'user has left ' + this.room.roomname + ': ', true);

  var userView = new UserView(socketEntity.currentUser);
  this.transmit([systemMessageView, userView]);

  for(var i=0; i<this.participants.length; i++) {
    if (this.participants[i].currentUser.login ===
          socketEntity.currentUser.login) {
      this.participants.splice(i,1);
    }
  }

}

RoomController.prototype.getName = function() {
  return this.room.roomname;
}

RoomController.prototype.getParticipants = function(socketEntity) {
  return this.participants;
}

RoomController.prototype.transmit = function(views) {
  for(var i=0; i<this.participants.length; i++) {
    this.participants[i].display(views);
  }
}

RoomController.prototype.chat = function(sender, message) {
  //todo (rrapp): convert messages to a proper view
  var view = new MessageView(sender, message, false, sender.fontColor);
  this.transmit([view]);
}

module.exports = RoomController;
