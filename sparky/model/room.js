/* Room model
*
*/

function RoomModel(roomname) {
  this.roomname = roomname;
}

var roomValidation = /^[A-Za-z0-9_]{2,20}$/;

RoomModel.prototype.validateRoomName = function(roomname) {
  //todo (rrapp): add login validation logic
  return roomValidation.test(roomname);
}

module.exports = RoomModel;
