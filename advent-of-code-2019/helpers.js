var fs = require("fs");

function readLines(input) {
  return new Promise((res, rej) => {
    let instructions = [];
    let string = "";
    input.on("data", function(data) {
      string += data;
      instructions = string.split(",").map(val => Number(val));
    });

    input.on("end", function() {
      res(instructions);
    });
  });
}

module.exports = {
  readAndParseFile: async function readAndParseFile(filename) {
    const input = fs.createReadStream(filename);
    return readLines(input);
  }
};
