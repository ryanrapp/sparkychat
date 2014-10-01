/* Rooms view**/var RoomView = require('./room.js');function RoomsView(rooms, inline) {  this.rooms = rooms;  this.inline = inline;}RoomsView.prototype.display = function(viewer) {  var activeRoomCount = 0;  var view = "Active rooms are\n";  for(var i=0; i<this.rooms.length; i++) {    if (this.rooms[i].getParticipantCount() > 0) {      var roomView = new RoomView(this.rooms[i]);      view += " * " + roomView.display(viewer) + '\n';      activeRoomCount++;    }  }  view += "end of list.";  if (!activeRoomCount) {    view = 'There are no active rooms.';  }  return view;}module.exports = RoomsView;