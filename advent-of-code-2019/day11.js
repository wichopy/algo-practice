const helpers = require("./helpers");
const IntCodeComputer = require("./IntCodeComputer");
const assert = require("assert");

const BLACK = 0;
const WHITE = 1;
const UP = "UP";
const DOWN = "DOWN";
const RIGHT = "RIGHT";
const LEFT = "LEFT";

async function robotPainting(filename, startingColor) {
  const initialInstructions = await helpers.readAndParseFile(filename);
  const icc = new IntCodeComputer({
    name: "day11"
    // withLogger: true
  });
  icc.build(initialInstructions);

  icc.addInputs(startingColor); // All squares are currently black
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

robotPainting("day11.txt", BLACK).then(res => {
  assert.equal(Object.keys(res).length, 1930);
});

robotPainting("day11.txt", WHITE).then(res => {
  let minx = Infinity;
  let miny = Infinity;
  let maxx = -Infinity;
  let maxy = -Infinity;
  for (let coord of Object.keys(res)) {
    const [x, y] = coord.split(":").map(str => parseInt(str));
    // console.log(x, y);
    minx = Math.min(minx, x);
    maxx = Math.max(maxx, x);
    miny = Math.min(miny, y);
    maxy = Math.max(maxy, y);
  }
  // console.log(minx, miny, maxx, maxy);
  const grid = [];
  for (let i = 0; i <= Math.abs(miny) + Math.abs(maxy); i++) {
    grid.push([]);
  }

  for (let entry of Object.entries(res)) {
    let [x, y] = entry[0].split(":").map(str => parseInt(str));
    const color = entry[1];
    y = Math.abs(y);
    // console.log(x, y, color);
    grid[y][x] = color;
  }
  // console.log(grid);

  console.log("look closely you should see PFKHECZU");
  for (let i = 0; i < grid.length; i++) {
    let line = "";
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === undefined) {
        line += 0;
        continue;
      }
      line += grid[i][j];
    }

    console.log(line);
  }
});
