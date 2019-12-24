const assert = require("assert");
const helpers = require("../helpers");

// convert the input text file into an array of single digit intergers.

// accept some input pattern.

function generatePositionPattern(inputPattern, position, length) {
  const pattern = [];

  let i = 0;

  while (pattern.length <= length) {
    let count = 0;
    while (count < position) {
      pattern.push(inputPattern[i]);
      count++;
      if (pattern.length > length) {
        break;
      }
    }

    if (i < inputPattern.length - 1) {
      i++;
    } else {
      i = 0;
    }
  }

  pattern.shift();

  return pattern;
}

function calculateDigit(input, pattern) {
  // console.log(input, pattern);
  let digit = 0;
  for (let i = 0; i < input.length; i++) {
    digit += pattern[i] * input[i];
    // console.log(digit, pattern[i], input[i]);
  }

  // console.log(digit);
  let string = String(digit);
  digit = parseInt(string[string.length - 1]);

  return digit;
}

function main(input, inputPattern, phases) {
  // initialization variables

  let phase = 1;
  let prevInput = input.split("").map(digit => parseInt(digit));
  // console.log(prevInput);
  while (phase <= phases) {
    let position = 1;
    const phaseOutput = [];
    while (phaseOutput.length < prevInput.length) {
      const pattern = generatePositionPattern(
        inputPattern,
        position,
        input.length
      );
      // console.log(pattern);
      const digit = calculateDigit(prevInput, pattern);
      if (String(digit) === "NaN") {
        // console.log(phase, position, pattern, digit);
        throw new Error("not a number");
      }
      // console.log(digit);
      phaseOutput.push(digit);
      position++;
    }

    prevInput = [...phaseOutput];
    // console.log("finished phase", phase, prevInput);
    phase++;
  }

  // console.log(prevInput);
  return prevInput.slice(0, 8).join("");
}

// algo inputs
const inputPattern = [0, 1, 0, -1];
const test0 = "12345678";

assert.deepEqual(main(test0, inputPattern, 100), `23845678`);

const test1 = "80871224585914546619083218645595";
assert.deepEqual(main(test1, inputPattern, 100), `24176176`);

helpers
  .readAndParseFile("./day16.txt", str => str)
  .then(res => {
    console.log(res.slice(0, 8));
    console.log(main(res, inputPattern, 100));
  });
