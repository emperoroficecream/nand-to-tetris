const Line = require('./Line');

function Parser(fileName) {
  let hasMoreLines = true;
  let currentLine;
  const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(fileName)
  });

  lineReader.on('line', (input) => {
    currentLine = new Line(input);
    if (currentLine.isCommand()) {
      console.log(`current line is ${input} 
      and its type is ${currentLine.commandType()} 
      and its comp is ${currentLine.comp()}`);
    }
  });

  lineReader.on('close', () => {
    hasMoreLines = false;
    console.log('no more lines');
  })

  const hasMoreCommands = () => {
    return hasMoreLines;
  }

  return {
    hasMoreCommands,
  }
}

module.exports = Parser;