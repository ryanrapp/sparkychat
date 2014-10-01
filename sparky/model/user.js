/* User model
*
*/

function UserModel(login, fontColor) {
  this.login = login;
  this.fontColor = fontColor;
}

var loginValidation = /^[A-Za-z0-9_]{3,20}$/;

UserModel.prototype.validateLogin = function(login) {
  //todo (rrapp): add login validation logic
  return loginValidation.test(login);
}

module.exports = UserModel;
