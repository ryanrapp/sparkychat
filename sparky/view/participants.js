/* Participants view
*
*/

var UserView = require('./user.js');

function ParticipantsView(participants, inline) {
  this.participants = participants;
  this.inline = inline;
}

ParticipantsView.prototype.display = function(viewer) {
  var view = "";
  for(var i=0; i<this.participants.length; i++) {
    if (this.participants[i].currentUser !== null) {
      var userView = new UserView(this.participants[i].currentUser);
      view += " * " + userView.display(viewer) + '\n';
    }
  }
  view += "end of list.";
  return view;
}

module.exports = ParticipantsView;
