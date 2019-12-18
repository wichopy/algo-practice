class IntCodeComputer {
  constructor({ name, withLogger } = {}) {
    this.name = name;
    this.instructions;
    this.initialInstructions;
    this.inputQueue = [];
    this.lastOutput;
    this.relativeBase = 0;
    this.withLogger = withLogger;
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

  parseOpMode(str) {
    switch (str) {
      case "1":
        return 1;
      case "2":
        return 2;
      case "0":
      case "":
        return 0;
    }
  }

  parsePointer(opMode, index) {
    let pointer;
    switch (opMode) {
      case 2:
        pointer = this.instructions[index] + this.relativeBase;
        break;
      case 1:
        pointer = index;
        break;
      case 0:
      default:
        pointer = this.instructions[index];
    }

    return pointer;
  }

  *runInstructions() {
    this.instructions = [...this.initialInstructions];
    let i = 0;
    while (i < this.instructions.length) {
      let opcode = this.instructions[i];
      let string = String(this.instructions[i]);
      let op1Mode = this.parseOpMode(string.charAt(string.length - 3));
      let op2Mode = this.parseOpMode(string.charAt(string.length - 4));
      let op3Mode = this.parseOpMode(string.charAt(string.length - 5));
      let operand1P = this.parsePointer(op1Mode, i + 1);
      let operand2P = this.parsePointer(op2Mode, i + 2);
      let operand1 = this.instructions[operand1P];
      let operand2 = this.instructions[operand2P];
      let operand3P = this.parsePointer(op3Mode, i + 3);

      if (opcode > 99) {
        opcode = this.instructions[i] % 100;
      }
      operand1 = operand1 === undefined ? 0 : operand1;
      operand2 = operand2 === undefined ? 0 : operand2;
      if (this.withLogger) {
        const names = {
          1: "add",
          2: "multiply",
          3: "input",
          4: "output",
          5: "skip if true",
          6: "skip if false",
          7: "set if less than",
          8: "set if equal",
          9: "set relative base",
          99: "halt"
        };
        console.log(
          names[opcode],
          this.instructions[i],
          "op1/op1 pointer:",
          `${operand1}/${operand1P}`,
          "op2/op2 pointer:",
          `${operand2}/${operand2P}`,
          "op3",
          operand3P,
          "relative base",
          this.relativeBase
        );
      }

      switch (opcode) {
        case 1:
          this.instructions[operand3P] = operand1 + operand2;
          i += 4;
          continue;
        case 2:
          this.instructions[operand3P] = operand1 * operand2;
          i += 4;
          continue;
        case 3:
          if (!this.inputQueue.length) {
            // throw new Error("Missing inputs");
            yield "feed me more inputs"; // Get more instructions.
          }

          this.instructions[operand1P] = this.inputQueue.shift();
          // console.log("using input", this.instructions[index]);
          i += 2;
          continue;
        case 4:
          // console.log(operand1, operand1P);
          if (operand1 === undefined) {
            this.lastOutput = 0;
            yield 0;
          } else {
            this.lastOutput = operand1;
            // console.log(this.instructions);
            // console.log("output", operand1);
            yield operand1;
          }
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
          this.instructions[operand3P] = operand1 < operand2 ? 1 : 0;
          i += 4;
          continue;
        case 8:
          // result = operand1 === operand2 ? 1 : 0;
          this.instructions[operand3P] = operand1 === operand2 ? 1 : 0;
          i += 4;
          continue;
        case 9:
          this.relativeBase += operand1;
          i += 2;
          continue;
        case 99:
          // console.log("99: stop");
          // throw this.lastOutput;
          return;
        default:
          // console.log("pointer", i);
          throw new Error("Unidentified op code" + opcode);
      }
    }
  }
}

module.exports = IntCodeComputer;
