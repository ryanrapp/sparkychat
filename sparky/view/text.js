/* Text view
*
*  Displays plain text
*/

function TextView(text, inline, fontColor) {
  this.text = text;
  this.inline = inline;
  this.fontColor = fontColor;
}

TextView.prototype.display = function(viewer) {
  return this.text;
}

module.exports = TextView;
