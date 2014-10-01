/* Whisper view
*
*  Displays whisper from sender
*/

var Utils = require('../utils.js');
var fontColor = 'cyan';

function WhisperView(sender, text, inline) {
  this.sender = sender;
  this.text = text;
  this.inline = inline;
}

WhisperView.prototype.display = function(viewer) {
  return Utils.prototype.colorizeFont(
      '[Whisper] ' + Utils.prototype.underlineFont(this.sender.login) +
      ': ' + this.text, 'cyan');
}

module.exports = WhisperView;
