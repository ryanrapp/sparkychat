/* Controller that manages the connection
*  with the client, including all i/o
*
*  Wraps socket.
*/

var net = require('net');
var UserModel = require('../model/user.js');
var RoomModel = require('../model/room.js');
var ParticipantsView = require('../view/participants.js');
var RoomsView = require('../view/rooms.js');
var TextView = require('../view/text.js');
var SystemMessageView = require('../view/systemmessage.js');
var WhisperView = require('../view/whisper.js');
var Utils = require('../utils.js');

function SocketController(parent, new_socket) {
  var that = this;
  this.myname = "mysocketcontroller";
  this.socket = new_socket;
  this.socket.socketController = this;
  this.serverController = parent;
  this.socket.on('data', function(data) {
    _receiveData.call(that, data);
  });
  this.socket.on('end', function() {
    that.serverController.closeSocket(that.socket);
  });
  this.currentUser = null;
  this.currentRoom = null;

  this.displayText('Welcome to the XYZ chat server\nLogin Name?');
}

/*
 * Responsible for logging in a user.
 */
function _loginUser(login) {
  if (!UserModel.prototype.validateLogin(login)) {
    this.displayText('Invalid Login Name.');
    return;
  }
  if (this.serverController.isUserLoggedIn(login)) {
    this.displayText('Sorry, name taken.');
    return;
  }
  this.currentUser = new UserModel(login);
  this.displayText('Welcome ' + this.currentUser.login + '!');
}

/*
 * Logic for available /commands
 */

var commands = {
  help: {
    desc: 'Teaches you about commands. Help-ception.'
  },
  rooms:{
    desc: 'See a list of active rooms',
    fn: function() {
      var rooms = this.serverController.getRooms();
      var roomsView = new RoomsView(rooms);
      this.display([roomsView]);
    }
  },
  color:{
    desc: 'Set your chat font color, e.g. /color blue',
    fn: function(fontColor) {
      if (this.serverController.allowedFontColors[fontColor]) {
        this.currentUser.fontColor = fontColor;
      }
      else {
        this.displayText('Not an allowed font color: ' + fontColor);
      }
    }
  },
  join: {
    desc: 'Join a chat room, e.g. /join thebestchat',
    fn: function(roomname) {
      if (this.currentRoom) {
        this.displayText('Must leave room before joining a new one.');
        return;
      }
      if (!RoomModel.prototype.validateRoomName(roomname)) {
        this.displayText('Invalid Room Name.');
        return;
      }
      var roomResult = this.serverController.findRoomByName(roomname);
      if (roomResult) {
        this.currentRoom = roomResult;
      }
      else {
        this.currentRoom = this.serverController.createRoom(roomname);
      }
      this.currentRoom.addParticipant(this);

      var enterMessageView = new TextView(
          'Entering room: ' + this.currentRoom.getName());

      var participants = this.currentRoom.getParticipants();
      var participantsView = new ParticipantsView(participants);

      this.display([enterMessageView, participantsView]);
    }
  },
  leave: {
    desc: 'Leave a chat room',
    fn: function() {
      if (!this.currentRoom) {
        this.displayText('Not currently in a room.');
        return;
      }
      this.currentRoom.removeParticipant(this);
      this.currentRoom = null;
    }
  },
  quit: {
    desc: 'Disconnect from the server',
    fn: function(roomname) {
      if (this.currentRoom) {
        this.currentRoom.removeParticipant(this);
        this.currentRoom = null;
      }
      this.socket.end('BYE');
    }
  },
  whisper: {
    desc: 'Whisper another user, e.g. /whisper tomsawyer Hello there!',
    fn: function(login, message) {
      var recipient = this.serverController.findSocketByLogin(login);
      if (recipient) {
        if (recipient.currentUser.login === this.currentUser.login) {
          this.displayText('Talking to yourself? Go right ahead.');
        }
        var whisperView = new WhisperView(this.currentUser, message);
        recipient.display([whisperView]);
        this.display([whisperView]);
      }
      else {
        this.displayText('No user could be found by the name of ' + login);
      }
    }
  }
};

commands['help']['fn'] = function(command) {

  if (command) {
    if (!commands[command]) {
      this.displayText('Not a valid command.');
      return;
    }
    var mytext = (Utils.prototype.underlineFont(command) + "\n" +
        commands[command].desc);

    this.displayText(mytext);
  }
  else {
    var mytext = 'Type /help command for help about a specific command:\n';
    for (var command in commands) {
      if (commands.hasOwnProperty(command)) {
        mytext += Utils.prototype.underlineFont(command) + "\n"
      }
    }
    this.displayText(mytext);
  }
}

/*
 * Method executed when data is received from a socket
 */
function _receiveData(data) {
  var cleanData = Utils.prototype.cleanInput(data);
  var commandInfo = Utils.prototype.parseCommand(cleanData);
  if (commandInfo) {
    if (commands[commandInfo['command']]) {
      commands[commandInfo['command']].fn.apply(
          this, commandInfo['args']);
      return;
    }
    else {
      this.displayText('Unknown command: "' + commandInfo['command'] + '".');
      return;
    }
  }

  if (!this.currentUser) {
    _loginUser.call(this, cleanData);
    return;
  }
  if (!this.currentRoom) {
    return;
  }
  else {
    this.currentRoom.chat.call(this.currentRoom, this.currentUser, cleanData);
    return;
  }
}

SocketController.prototype.display = function(views) {
  output = '';
  for(var i=0; i<views.length; i++) {
    if (views[i]) { // Protect against removals during loop.
      output += views[i].display(this);
      if (!views[i].inline) {
        output += '\n';
      }
    }
  }
  this.write(output);
}

SocketController.prototype.displayText = function(text) {
  var textView = new TextView(text);
  return this.display([textView]);
}

/*
*  Pass through certain functions to the socket
*/
SocketController.prototype.write = function(message) {
  this.socket.write.apply(this.socket, arguments);
}
SocketController.prototype.on = function() {
  this.socket.on.apply(this.socket, arguments);
}
SocketController.prototype.end = function() {
  this.socket.end.apply(this.socket, arguments);
}

module.exports = SocketController;
