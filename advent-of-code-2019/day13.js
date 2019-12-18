const helpers = require("./helpers");
const IntCodeComputer = require("./IntCodeComputer");
const assert = require("assert");

helpers.readAndParseFile("day13.txt").then(instructions => {
  const icc = new IntCodeComputer({
    name: "day13"
    // withLogger: true
  });
  icc.build(instructions);

  const outputs = [];

  const gen = icc.runInstructions();
  let result;
  let blocks = 0;
  while (!result || !result.done) {
    const trio = [];
    result = gen.next();
    trio.push(result.value);
    result = gen.next();
    trio.push(result.value);
    result = gen.next();
    if (result.value === 2) {
      blocks++;
    }
    trio.push(result.value);
    outputs.push(trio);
  }
  console.log(blocks);
  assert.equal(blocks, 398);
  return outputs;
});
