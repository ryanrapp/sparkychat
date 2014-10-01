/* System message view
*
*  Displays system message
*/

function SystemMessageView(text, inline) {
  this.text = text;
  this.inline = inline;
}

SystemMessageView.prototype.display = function(viewer) {
  return ' * ' + this.text;
}

module.exports = SystemMessageView;
