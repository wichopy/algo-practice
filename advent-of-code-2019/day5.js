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

async function main(testInput, filename) {
  const input = fs.createReadStream(filename);
  const instructions = await readLines(input);

  // console.log(instructions, instructions.length);
  let i = 0;
  while (i < instructions.length) {
    if (instructions[i] === 3) {
      // Input at next index
      const index = instructions[i + 1];
      instructions[index] = testInput;
      i += 2;
      continue;
    }

    if (instructions[i] === 4) {
      // output at next index
      console.log(
        "Output Result position:",
        instructions[instructions[i + 1]],
        i + 1
      );
      i += 2;
      continue;
    }

    if (instructions[i] === 1) {
      // add numbers from two positions
      let operand1 = instructions[instructions[i + 1]];
      let operand2 = instructions[instructions[i + 2]];
      let resultIndex = instructions[i + 3];
      let result = operand1 + operand2;
      instructions[resultIndex] = result;
      i += 4;
      continue;
    }

    if (instructions[i] === 2) {
      // multiply numbers from two positions
      let operand1 = instructions[instructions[i + 1]];
      let operand2 = instructions[instructions[i + 2]];
      let resultIndex = instructions[i + 3];
      let result = operand1 * operand2;
      instructions[resultIndex] = result;
      i += 4;
      continue;
    }

    if (instructions[i] === 99) {
      console.log("99: stop");
      return;
    }

    let opcode = String(instructions[i]);

    let operand1ModeIsImmediate = opcode.charAt(opcode.length - 3) === "1";
    let operand2ModeIsImmediate = opcode.charAt(opcode.length - 4) === "1";
    let resultModeIsImmediate = opcode.charAt(opcode.length - 5) === "1";
    let operand1 = operand1ModeIsImmediate
      ? instructions[i + 1]
      : instructions[instructions[i + 1]];
    let operand2 = operand2ModeIsImmediate
      ? instructions[i + 2]
      : instructions[instructions[i + 2]];
    let resultIndex = resultModeIsImmediate ? i + 3 : instructions[i + 3];
    let result;
    switch (opcode.substring(opcode.length - 2)) {
      case "01":
        result = operand1 + operand2;
        instructions[resultIndex] = result;
        i += 4;
        continue;
      case "02":
        result = operand1 * operand2;
        instructions[resultIndex] = result;
        i += 4;
        continue;
      case "03":
        i += 2;
        continue;
      case "04":
        console.log("Output Result immediate:", operand1);
        i += 2;
        continue;
      default:
        throw new Error("Unidentified op code" + opcode);
    }
    break;
  }
}

function test(value, instructions) {
  let i = 0;
  while (true) {
    if (instructions[i] === 3) {
      let input = value;
      let output = instructions[i + 1];
      instructions[output] = input;
      i += 2;
      continue;
    }

    if (instructions[i] === 4) {
      let index = i + 1;
      console.log("output ", instructions[instructions[index]]);
      i += 2;
      continue;
    }

    if (instructions[i] === 99) {
      console.log("halting");
      return;
    }
  }
}

console.log(test(1, [3, 0, 4, 0, 99]));
main(1, "day5.txt");
