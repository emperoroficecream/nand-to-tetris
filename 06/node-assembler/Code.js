const COMP_TABLE = Object.freeze({
  '0':     '0101010',
  '1':     '0111111',
  '-1':    '0111010',
  'D':     '0001100',
  'A':     '0110000',
  '!D':    '0001101',
  '!A':    '0110001',
  '-D':    '0001111',
  '-A':    '0110011',
  'D+1':   '0011111',
  'A+1':   '0110111',
  'D-1':   '0001110',
  'A-1':   '0110010',
  'D+A':   '0000010',
  'D-A':   '0010011',
  'A-D':   '0000111',
  'D&A':   '0000000',
  'D|A':   '0010101',
  'M':     '1110000',
  '!M':    '1110001',
  '-M':    '1110011',
  'M+1':   '1110111',
  'M-1':   '1110010',
  'D+M':   '1000010',
  'D-M':   '1010011',
  'M-D':   '1000111',
  'D&M':   '1000000',
  'D|M':   '1010101',
});

const DEST_TABLE = Object.freeze({
  'M':   '001',
  'D':   '010',
  'MD':  '011',
  'A':   '100',
  'AM':  '101',
  'AD':  '110',
  'AMD': '111'
});

const JUMP_TABLE = Object.freeze({
  'JGT': '001',
  'JEQ': '010',
  'JGE': '011',
  'JLT': '100',
  'JNE': '101',
  'JLE': '110',
  'JMP': '111'
});


function pad(n, width) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length).fill('0').join('') + n;
}

function dec2bin(dec){
    return (dec >>> 0).toString(2);
}

function parseCCommand(cmd) {
  const dest = cmd.dest();
  const comp = cmd.comp();
  const jump = cmd.jump();
  return `111${COMP_TABLE[comp]}${dest ? DEST_TABLE[dest] : '000'}${jump ? JUMP_TABLE[jump] : '000'}`;
}

// Returns binary code as strings
function convertToBinary(cmd) {
  if (cmd.type === 'A_COMMAND') {
    return pad(dec2bin(cmd.symbol()), 16) // Symbol in symbol-less asm code will be just a number
  } else if (cmd.type === 'C_COMMAND') {
    return parseCCommand(cmd);
  }
}

module.exports = convertToBinary;