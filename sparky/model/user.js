/* User model
*
*/

function UserModel(login) {
  this.login = login;
}

UserModel.prototype.validateLogin = function(login) {
  //todo (rrapp): add login validation logic
  return true;
}

module.exports = UserModel;
