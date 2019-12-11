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
    let opcode = instructions[i];
    let string = String(instructions[i]);
    let op1Mode = string.charAt(string.length - 3) === "1" ? 1 : 0;
    let op2Mode = string.charAt(string.length - 4) === "1" ? 1 : 0;
    let op3Mode = string.charAt(string.length - 5) === "1" ? 1 : 0;
    let operand1 = op1Mode
      ? instructions[i + 1]
      : instructions[instructions[i + 1]];
    let operand2 = op2Mode
      ? instructions[i + 2]
      : instructions[instructions[i + 2]];
    let operand3 = op3Mode ? i + 3 : instructions[i + 3];

    if (opcode > 99) {
      opcode = instructions[i] % 100;
    }
    const names = {
      1: "add",
      2: "multiply",
      3: "input",
      4: "output",
      5: "skip if true",
      6: "skip if false",
      7: "set if less than",
      8: "set if equal"
    };

    console.log(
      opcode,
      op1Mode,
      op2Mode,
      op3Mode,
      operand1,
      operand2,
      operand3,
      names[opcode]
    );
    switch (opcode) {
      case 1:
        // let operand1 = instructions[instructions[i + 1]];
        // let operand2 = instructions[instructions[i + 2]];
        // let resultIndex = instructions[i + 3];
        // let result = operand1 + operand2;
        instructions[operand3] = operand1 + operand2;
        i += 4;
        continue;
      case 2:
        instructions[operand3] = operand1 * operand2;
        i += 4;
        continue;
      case 3:
        console.log("using input:", testInput);
        const index = instructions[i + 1];
        instructions[index] = testInput;
        i += 2;
        continue;
      case 4:
        console.log("Output Result position:", operand1, i + 1);
        i += 2;
        continue;
      case 5:
        // Set pointer to value at second param (position or immediate) if first param is not 0
        if (operand1 !== 0) {
          i = operand2;
        } else {
          // otherwise skip
          i += 3;
        }
        continue;
      case 6:
        // Set pointer to value at second param (position or immediate) if first param is 0
        if (operand1 === 0) {
          i = operand2;
        } else {
          // otherwise skip
          i += 3;
        }
        continue;
      case 7:
        result = operand1 < operand2 ? 1 : 0;
        instructions[operand3] = result;
        i += 4;
        continue;
      case 8:
        result = operand1 === operand2 ? 1 : 0;
        instructions[operand3] = result;
        i += 4;
        continue;
      case 99:
        console.log("99: stop");
        return;
      default:
        console.log("pointer", i);
        throw new Error("Unidentified op code" + opcode);
    }
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

function testSomething(input, instructions) {
  let i = 0;
  while (true) {
    let opcode = instructions[i];
    let string = String(instructions[i]);
    let op1Mode = string.charAt(string.length - 3) === "1" ? 1 : 0;
    let op2Mode = string.charAt(string.length - 4) === "1" ? 1 : 0;
    let op3Mode = string.charAt(string.length - 5) === "1" ? 1 : 0;
    if (opcode > 99) {
      opcode = instructions[i] % 100;
      console.log(opcode, op1Mode, op2Mode, op3Mode);
    }
    if (opcode === 3) {
      instructions[instructions[i + 1]] = input;
      i += 2;
      continue;
    }
    if (opcode === 5) {
      // Set pointer to value at second param (position or immediate) if first param is not 0
      if (instructions[instructions[i + 1]] !== 0) {
        i = instructions[i + 2];
      } else {
        // otherwise skip
        i += 3;
      }

      continue;
    }

    if (opcode === 6) {
      console.log("op code 6");
      // Set pointer to value at second param (position or immediate) if first param is 0
      if (instructions[instructions[i + 1]] === 0) {
        i = instructions[instructions[i + 2]];
      } else {
        // otherwise skip
        i += 3;
      }

      continue;
    }
    if (opcode === 8) {
      result =
        instructions[instructions[i + 1]] === instructions[instructions[i + 2]]
          ? 1
          : 0;
      instructions[instructions[i + 3]] = result;
      i += 4;
      continue;
    }
    if (opcode === 7) {
      result =
        instructions[instructions[i + 1]] < instructions[instructions[i + 2]]
          ? 1
          : 0;
      instructions[instructions[i + 3]] = result;
      i += 4;
      continue;
    }
    if (opcode === 4) {
      console.log(instructions[operand1]);
      i += 2;
      continue;
    }

    if (opcode === 1) {
      instructions[instructions[i + 3]] =
        instructions[instructions[i + 1]] + instructions[instructions[i + 2]];
      i += 4;
      continue;
    }

    if (opcode === 2) {
      console.log(instructions[instructions[i + 1]]);
      i += 2;
      continue;
    }
    if (opcode === 99) {
      return;
    }
  }
}

// console.log(
// testSomething(0, [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9])
//                                                    9         12  13 14 15
// );
// console.log(test(1, [3, 0, 4, 0, 99]));
main(5, "day5.txt");
// main(0, "day7.txt");
