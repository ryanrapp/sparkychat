/* Various utility functions
*
*/

var fontColorMap = {
  black: '[30m',
  red: '[31m',
  green: '[32m',
  yellow: '[33m',
  blue: '[34m',
  magenta: '[35m',
  cyan: '[36m',
}

var esc = String.fromCharCode(27);

function Utils() {

}

/*
 * Cleans the input of carriage return, newline
 */

Utils.prototype.cleanInput = function(data) {
  return data.toString().replace(/(\r\n|\n|\r)/gm,"");
}
Utils.prototype.parseCommand = function(data) {
  /* Parses out command into arguments.
  *  Special logic for whisper, which only has one argument.
  */
  if (data.substr(0,1) == '/') {
    var words = data.split(' ');

    // Strip slash
    var command = words[0].substr(1);
    words.splice(0,1);
    if (command === 'whisper') {
      //Get all the remaining text as the whisper message.
      words = [words[0], data.substr(10 + words[0].length)];
    }
    return {
      'command': command,
      'args': words
    };
  }
  return null;
}

Utils.prototype.colorizeFont = function(text, fontColor) {
  if (fontColor) {
    var fontColorSymbol = fontColorMap[fontColor];
    return (esc + fontColorSymbol + text +
      esc + '[39m');
  }
  return text;
}

Utils.prototype.underlineFont = function(text) {
  return esc + '[4m' + text + esc + '[24m';
}

module.exports = Utils;
