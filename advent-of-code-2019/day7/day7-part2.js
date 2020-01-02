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

class IntCodeComputer {
  constructor(name) {
    this.name = name;
    this.instructions;
    this.initialInstructions;
    this.inputQueue = [];
    this.lastOutput;
  }

  async build(instructionSet) {
    this.initialInstructions = [...instructionSet];
  }

  reset() {
    this.inputQueue = [];
    this.lastOutput = undefined;
  }

  addInputs(input) {
    this.inputQueue.push(input);
  }
  *runInstructions() {
    this.instructions = [...this.initialInstructions];
    let i = 0;
    while (i < this.instructions.length) {
      let opcode = this.instructions[i];
      let string = String(this.instructions[i]);
      let op1Mode = string.charAt(string.length - 3) === "1" ? 1 : 0;
      let op2Mode = string.charAt(string.length - 4) === "1" ? 1 : 0;
      let op3Mode = string.charAt(string.length - 5) === "1" ? 1 : 0;
      let operand1 = op1Mode
        ? this.instructions[i + 1]
        : this.instructions[this.instructions[i + 1]];
      let operand2 = op2Mode
        ? this.instructions[i + 2]
        : this.instructions[this.instructions[i + 2]];
      let operand3 = op3Mode ? i + 3 : this.instructions[i + 3];

      if (opcode > 99) {
        opcode = this.instructions[i] % 100;
      }
      // console.log(opcode, operand1, operand1, operand3);
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

      switch (opcode) {
        case 1:
          this.instructions[operand3] = operand1 + operand2;
          i += 4;
          continue;
        case 2:
          this.instructions[operand3] = operand1 * operand2;
          i += 4;
          continue;
        case 3:
          const index = this.instructions[i + 1];
          if (!this.inputQueue.length) {
            // throw new Error("Missing inputs");
            yield "feed me more inputs"; // Get more instructions.
          }
          this.instructions[index] = this.inputQueue.shift();
          // console.log("using input", this.instructions[index]);
          i += 2;
          continue;
        case 4:
          this.lastOutput = operand1;
          // console.log("output", operand1);
          yield operand1;
          // console.log("outputting..", this.lastOutput);
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
          // result = operand1 < operand2 ? 1 : 0;
          this.instructions[operand3] = operand1 < operand2 ? 1 : 0;
          i += 4;
          continue;
        case 8:
          // result = operand1 === operand2 ? 1 : 0;
          this.instructions[operand3] = operand1 === operand2 ? 1 : 0;
          i += 4;
          continue;
        case 99:
          // console.log("99: stop");
          // throw this.lastOutput;
          return this.lastOutput;
        default:
          // console.log("pointer", i);
          throw new Error("Unidentified op code" + opcode);
      }
    }
  }
}

async function mainWithFeedback(instructionSet) {
  const nums = [5, 6, 7, 8, 9];
  const combos = [];
  let initialInstructions;

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

  if (typeof instructionSet !== "string") {
    initialInstructions = instructionSet;
  } else {
    initialInstructions = await readAndParseFile(instructionSet);
  }

  let max = -Infinity;
  let maxOrientation = "";

  const ampNames = {
    0: "A",
    1: "B",
    2: "C",
    3: "D",
    4: "E"
  };
  // amplifier first round takes a phase setting and then an input
  // All rounds after just takes an output from the previous amplifier.

  for (let index = 0; index < combos.length; index++) {
    let key = "";
    let input;
    const amplifiers = [];
    const generators = [];
    for (let i = 0; i < combos[index].length; i++) {
      const amp = new IntCodeComputer(ampNames[i]);
      amp.build(initialInstructions);
      amplifiers.push(amp);
      let gen = amp.runInstructions();
      generators.push(gen);
      amp.addInputs(combos[index][i]);
      amp.addInputs(!input ? 0 : input.value);
      key += combos[index][i];
      input = gen.next();
    }

    let i = 0;
    let gen;
    let amp;
    while (!input.done) {
      amp = amplifiers[i];
      gen = generators[i];
      amp.addInputs(input.value);
      input = gen.next();
      if (i === 4) {
        i = 0;
      } else {
        i += 1;
      }
    }

    for (let i = 1; i < 5; i++) {
      amp = amplifiers[i];
      gen = generators[i];
      amp.addInputs(input.value);
      input = gen.next();
    }

    if (input.value > max) {
      max = input.value;
      maxOrientation = key;
    }
  }

  console.log("Max orientation of phases", maxOrientation);
  return max;
}

async function readAndParseFile(filename) {
  const input = fs.createReadStream(filename);
  return readLines(input);
}

readAndParseFile("day5.txt").then(instructions => {
  const icc = new IntCodeComputer();
  icc.build(instructions);
  icc.addInputs(5);
  let gen = icc.runInstructions();
  let result = gen.next();
  assert.equal(result.value, 918655);
});

// main("day7.txt").then(res => console.log("day 7 part 1: ", res));

// main("day7test2.txt").then(res => {
//   assert.equal(res, 43210);
// });

// main("day7test1.txt").then(res => {
//   assert.equal(res, 65210);
// });

// main("day7test3.txt").then(res => {
//   assert.equal(res, 54321);
// });

mainWithFeedback("day7.txt").then(res => console.log("day 7 part 2: ", res));

mainWithFeedback("day7p2t2.txt").then(res => {
  assert.equal(res, 18216);
});

mainWithFeedback("day7p2t1.txt").then(res => {
  assert.equal(res, 139629729);
});
