const helpers = require("./helpers");
const IntCodeComputer = require("./IntCodeComputer");
const assert = require("assert");

helpers.readAndParseFile("day13.txt").then(instructions => {
  const icc = new IntCodeComputer({
    name: "day13"
    // withLogger: true,
    // loggerFilter: opcode => {
    //   if (
    //     opcode === 3
    //     //  || opcode === 4
    //   )
    //     return true;
    //   return false;
    // }
  });

  // Start the game:
  instructions[0] = 2;

  icc.build(instructions);

  // X coordinates of the ball and paddle need to be tracked so we can program our input to follow the ball.
  let ballX;
  let paddleX;

  // 39 x 23
  const screen = [];
  let score;
  for (let i = 0; i < 28; i++) {
    screen.push([]);
  }
  const gen = icc.runInstructions();
  let result;
  while (!result || !result.done) {
    const trio = [];
    result = gen.next();
    trio.push(result.value);
    result = gen.next();
    trio.push(result.value);
    result = gen.next();
    trio.push(result.value);

    if (trio[0] === -1 && trio[1] === 0) {
      console.log("score:", trio[2]);
      score = trio[2];
    } else if (
      trio[0] !== undefined &&
      trio[1] !== undefined &&
      trio[2] !== undefined
    ) {
      if (trio[2] === 4) {
        ballX = trio[0];

        // Make the paddle follow the ball.
        if (paddleX > ballX) {
          icc.addInputs(-1);
        } else if (paddleX < ballX) {
          icc.addInputs(1);
        } else {
          icc.addInputs(0);
        }
      } else if (trio[2] === 3) {
        paddleX = trio[0];
      }

      screen[trio[1]][trio[0]] = trio[2];
    }

    // if (screen[23][39] !== undefined) {
    //   let line = "";
    //   for (let i = 0; i < 24; i++) {
    //     if (screen[i] === undefined) continue;
    //     for (let j = 0; j < 40; j++) {
    //       line += screen[i][j];
    //     }
    //     line += "\n";
    //   }
    //   console.log(line);
    // }
  }
  assert.equal(score, 19447);
});
