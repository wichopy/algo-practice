const helpers = require("./helpers");
const IntCodeComputer = require("./IntCodeComputer");
const assert = require("assert");

const BLACK = 0;
const WHITE = 1;
const UP = "UP";
const DOWN = "DOWN";
const RIGHT = "RIGHT";
const LEFT = "LEFT";

async function robotPainting(filename, input) {
  const initialInstructions = await helpers.readAndParseFile(filename);
  const icc = new IntCodeComputer({
    name: "day11"
    // withLogger: true
  });
  icc.build(initialInstructions);

  icc.addInputs(BLACK); // All squares are currently black
  const output = { "0:0": BLACK };
  let coords = [0, 0]; // x, y
  let currentDir = UP;

  let gen = icc.runInstructions();
  let result = gen.next();

  while (!result.done) {
    // store painted color in map
    output[`${coords[0]}:${coords[1]}`] = result.value;

    result = gen.next();
    // Direction to move
    // Right
    if (result.value === 1) {
      switch (currentDir) {
        case UP:
          currentDir = RIGHT;
          coords[0] += 1;
          break;
        case DOWN:
          currentDir = LEFT;
          coords[0] -= 1;
          break;
        case RIGHT:
          currentDir = DOWN;
          coords[1] -= 1;
          break;
        case LEFT:
          currentDir = UP;
          coords[1] += 1;
          break;
      }
    } else {
      switch (currentDir) {
        case UP:
          currentDir = LEFT;
          coords[0] -= 1;
          break;
        case DOWN:
          currentDir = RIGHT;
          coords[0] += 1;
          break;
        case RIGHT:
          currentDir = UP;
          coords[1] += 1;
          break;
        case LEFT:
          currentDir = DOWN;
          coords[1] -= 1;
          break;
      }
    }

    // Add current square color as input to ICC
    if (output[`${coords[0]}:${coords[1]}`]) {
      icc.addInputs(output[`${coords[0]}:${coords[1]}`]);
    } else {
      icc.addInputs(BLACK);
    }
    result = gen.next();
  }
  return output;
}

robotPainting("day11.txt").then(res => {
  assert(Object.keys(res).length, 1930);
});
