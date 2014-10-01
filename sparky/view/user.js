/* User view
*
*/

function UserView(user, inline) {
  this.user = user;
  this.inline = inline;
}

UserView.prototype.display = function(viewer) {
  var output;
  if (this.user !== null) {
    if (this.user.login == viewer.currentUser.login) {
      output = (String.fromCharCode(27) + '[32m' + this.user.login +
            ' (**this is you)' + String.fromCharCode(27) + '[39m');
    }
    else {
      output = this.user.login;
    }
  }
  return output;
}

module.exports = UserView;
