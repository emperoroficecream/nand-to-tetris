const CommandTypes = Object.freeze({
  A_COMMAND: 'A_COMMAND',
  C_COMMAND: 'C_COMMAND',
  L_COMMAND: 'L_COMMAND',
});

const clean = (input) => {
  // remove comments (strings starting with "//") and trim whitespaces
  return input.replace(/\/\/.*$/, '').trim();
}

function Line(input) {
  this.content = clean(input);
  if (this.isCommand()) {
    this.type = this.commandType();
    this.parseCCommand(this.content);
  }
}

Line.prototype.parseCCommand = function(command) {
  if (this.type !== CommandTypes.C_COMMAND) {
    return;
  }
  const destPattern = /^.*(?=(\=))/;
  const jumpPattern = /;(.*)/;
  this._dest = command.match(destPattern) && command.match(destPattern)[0];
  this._jump = command.match(jumpPattern) && command.match(jumpPattern)[1];
  this._comp = command;
  if (command.includes('=')) {
    this._comp = this._comp.match(/\=(.*)/)[1];
  }
  if (command.includes(';')) {
    this._comp = this._comp.match(/^.*(?=(\;))/)[0];
  }
}

Line.prototype.dest = function() {
  return this._dest;
}

Line.prototype.comp = function() {
  return this._comp;
}

Line.prototype.jump = function() {
  return this._jump;
}

Line.prototype.isCommand = function() {
  return !!this.content;
}

Line.prototype.commandType = function() {
  // if starts with "@" then A-command
  const command = this.content.slice();
  return command.startsWith('@') ? 
    CommandTypes.A_COMMAND : 
    // if contains "(xxx)" then L-command
    // else C-command
    ((/\(.+\)/.test(command)) ? 
      CommandTypes.L_COMMAND : 
      CommandTypes.C_COMMAND )  
}

Line.prototype.symbol = function() {
  const command = this.content.slice();
  const type = this.commandType();
  if (type === CommandTypes.A_COMMAND) {
    return command.replace('@', '');
  } else if (type === CommandTypes.L_COMMAND) {
    return command.replace(/[()]/g, '');
  }
}

module.exports = Line;