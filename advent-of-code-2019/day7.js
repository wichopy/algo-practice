var fs = require("fs");
const assert = require("assert");

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

async function intcode(inputQueue, instructionSet) {
  let instructions;

  if (typeof instructionSet !== "string") {
    instructions = instructionSet;
  } else {
    const input = fs.createReadStream(instructionSet);
    instructions = await readLines(input);
  }

  let i = 0;
  let lastOutput;
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
        // console.log("add", operand1, operand2);
        i += 4;
        continue;
      case 2:
        instructions[operand3] = operand1 * operand2;
        // console.log("multiply", operand1, operand2);
        i += 4;
        continue;
      case 3:
        const index = instructions[i + 1];
        instructions[index] = inputQueue.shift();
        // console.log("input:", instructions[index]);
        i += 2;
        continue;
      case 4:
        // console.log("output ", operand1);
        lastOutput = operand1;
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
        // console.log("99: stop");
        return lastOutput;
      default:
        console.log("pointer", i);
        throw new Error("Unidentified op code" + opcode);
    }
  }
}

async function main(instructionSet) {
  const nums = [0, 1, 2, 3, 4];
  const combos = [];
  function makeCombos(start, end) {
    if (start === end) {
      combos.push([...nums]);
      return;
    }
    for (let i = start; i <= end; i++) {
      let temp = nums[start];
      nums[start] = nums[i];
      nums[i] = temp;
      makeCombos(start + 1, end);
      temp = nums[i];
      nums[i] = nums[start];
      nums[start] = temp;
    }
  }

  makeCombos(0, 4);
  // console.log(combos);

  let max = -Infinity;
  let maxOrientation = "";
  // Cache partially complete calculations to reduce repetition
  const memo = {};
  for (let index = 0; index < combos.length; index++) {
    let key = "";
    let input = 0;
    for (let i = 0; i < combos[index].length; i++) {
      key += combos[index][i];
      if (memo[key]) {
        input = memo[key];
      } else {
        input = await intcode([combos[index][i], input], instructionSet);
        memo[key] = input;
      }
    }

    if (input > max) {
      max = input;
      maxOrientation = key;
    }
  }

  console.log(max, maxOrientation);
  return max;
}

intcode([5], "day5.txt").then(res => {
  assert.equal(res, 918655);
});

// main("day7.txt").then(res => console.log("day 7 part 1: ", res));

main("day7test2.txt").then(res => {
  assert.equal(res, 43210);
});

main("day7test1.txt").then(res => {
  assert.equal(res, 65210);
});

main("day7test3.txt").then(res => {
  assert.equal(res, 54321);
});
