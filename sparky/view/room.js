/* Room view
*
*/

function RoomView(room, inline) {
  this.room = room;
  this.inline = inline;
}

RoomView.prototype.display = function(viewer) {
  view = "";

  if (this.room !== null) {
    view += this.room.getName() + ' (' + this.room.getParticipantCount() + ')';
  }
  return view;
}

module.exports = RoomView;
