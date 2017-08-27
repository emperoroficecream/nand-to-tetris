const Line = require('./Line');
const fs = require('fs');
const toBinary = require('./Code');

const PREDEFINED_SYMBOLS = Object.freeze({
  SP:     '0',
  LCL:    '1',
  ARG:    '2',
  THIS:   '3',
  THAT:   '4',
  R0:     '0',
  R1:     '1',
  R2:     '2',
  R3:     '3',
  R4:     '4',
  R5:     '5',
  R6:     '6',
  R7:     '7',
  R8:     '8',
  R9:     '9',
  R10:    '10',
  R11:    '11',
  R12:    '12',
  R13:    '13',
  R14:    '14',
  R15:    '15',
  SCREEN: '16384',
  KBD:    '24576'
});

const symbolTable = Object.assign({}, PREDEFINED_SYMBOLS);
const commands = [];

function Parser(fileName) {
  let hasMoreLines = true;
  let currentLine;
  const lineReader = require('readline').createInterface({
    input: fs.createReadStream(fileName)
  });

  // Only increment line number when command is A- or C-instruction
  let lineNumber = -1;
  let RAMCounter = 15;

  lineReader.on('line', (input) => {
    currentLine = new Line(input);
    if (currentLine.isCommand()) {
      const currentSymbol = currentLine.symbol();
      if (currentLine.type === 'A_COMMAND' || currentLine.type === 'C_COMMAND') {
        lineNumber++;
        currentLine.number = lineNumber;
      } else if (currentLine.type === 'L_COMMAND') {
        // Put a new entry in the symbol table
        symbolTable[currentSymbol] = lineNumber + 1;
      }
      commands.push(currentLine);
    }
  });

  lineReader.on('close', () => {
    hasMoreLines = false;
    const originalFileName = fileName.split('/').pop().split('.')[0];
    const symbolLessFileName = originalFileName + 'L.asm';
    const binaryFileName = originalFileName + '.hack';
    const ws = fs.createWriteStream(`symbol-less/${symbolLessFileName}`, { flags: 'w' });
    const binaryWS = fs.createWriteStream(`binary/${binaryFileName}`, { flags: 'w' });
    // Second pass: parse variables
    commands.forEach((c) => {
      const currentSymbol = c.symbol();
      if (c.type === 'A_COMMAND' && !Number.isInteger(Number(currentSymbol))) {
        if (!symbolTable.hasOwnProperty(currentSymbol)) {
          // Declare a new variable
          RAMCounter++;
          symbolTable[currentSymbol] = RAMCounter;       
        }
        c.content = c.content.replace(currentSymbol, symbolTable[currentSymbol]);
      }
      if (!c.isPseudoCommand()) {
        ws.write(`${c.content}\n`);
        console.log(`command: ${c.content} ${c.dest()} ${c.comp()} ${c.jump()}`);
        const binaryCode = toBinary(c);
        binaryWS.write(`${binaryCode}\n`);
      }
    });
    ws.end();
    console.log(symbolTable);
  })

  const hasMoreCommands = () => {
    return hasMoreLines;
  }

  return {
    hasMoreCommands,
  }
}

module.exports = Parser;