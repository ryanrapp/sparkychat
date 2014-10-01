/* Message view
*
*  Displays message from sender
*/

var Utils = require('../utils.js');

function MessageView(sender, text, inline, fontColor) {
  this.sender = sender;
  this.text = text;
  this.inline = inline;
  this.fontColor = fontColor;
}

MessageView.prototype.display = function(viewer) {
  return (Utils.prototype.underlineFont(this.sender.login) +
          ': ' + Utils.prototype.colorizeFont(this.text, this.fontColor));
}

module.exports = MessageView;
