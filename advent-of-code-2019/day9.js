const helpers = require("./helpers");
const IntCodeComputer = require("./IntCodeComputer");
const assert = require("assert");

async function main(filename, input) {
  const initialInstructions = await helpers.readAndParseFile(filename);

  const icc = new IntCodeComputer({
    name: "day9"
    // withLogger: true
  });
  icc.build(initialInstructions);
  icc.addInputs(input);
  let gen = icc.runInstructions();
  const output = [];
  let i = 0;
  let result = gen.next();
  while (!result.done) {
    i++;
    output.push(result.value);
    result = gen.next();
  }
  return output;
}

main("day9.txt", 1).then(res => {
  console.log(res);
  assert.deepEqual(res, [3063082071]);
});

main("day9.txt", 2).then(res => {
  console.log(res);
  assert.deepEqual(res, [81348]);
});

// helpers.readAndParseFile("day5.txt").then(instructions => {
//   const icc = new IntCodeComputer();
//   icc.build(instructions);
//   icc.addInputs(5);
//   let gen = icc.runInstructions();
//   let result = gen.next();
//   assert.equal(result.value, 918655);
// });

// helpers.readAndParseFile("day9p1t3.txt").then(res => {
//   const icc = new IntCodeComputer();
//   icc.build(res);
//   let gen = icc.runInstructions();
//   let output = [];
//   let i = 0;
//   let result = gen.next();
//   while (!result.done && i < 10) {
//     i++;
//     output.push(result.value);
//     result = gen.next();
//   }
//   assert.equal(output[0], 1125899906842624);
//   console.log("Can output long numbers");
// });

// helpers.readAndParseFile("day9p1t2.txt").then(res => {
//   const icc = new IntCodeComputer();
//   icc.build(res);
//   let gen = icc.runInstructions();
//   icc.addInputs(1);
//   let output = [];
//   let i = 0;
//   let result = gen.next();
//   while (!result.done && i < 10) {
//     i++;
//     output.push(result.value);
//     result = gen.next();
//   }
//   assert.equal(output[0], 34915192 * 34915192);
//   console.log("Can output long numbers");
// });

// helpers.readAndParseFile("day9p1t1.txt").then(res => {
//   const icc = new IntCodeComputer();
//   icc.build(res);
//   let gen = icc.runInstructions();
//   const output = [];
//   let i = 0;
//   let result = gen.next();
//   while (!result.done) {
//     i++;
//     output.push(result.value);
//     result = gen.next();
//   }
//   assert.deepEqual(output, [
//     109,
//     1,
//     204,
//     -1,
//     1001,
//     100,
//     1,
//     100,
//     1008,
//     100,
//     16,
//     101,
//     1006,
//     101,
//     0,
//     99
//   ]);
//   console.log("test 1 passed");
// });

// helpers.readAndParseFile("day9p1t4.txt").then(res => {
//   const icc = new IntCodeComputer({ name: "test4", withLogger: true });
//   icc.build(res);
//   let gen = icc.runInstructions();
//   const output = [];
//   let i = 0;
//   let result = gen.next();
//   while (!result.done) {
//     i++;
//     output.push(result.value);
//     result = gen.next();
//   }
//   assert.deepEqual(output[0], 109);
//   console.log("Can perform opcode 9, test 4");
// });

// helpers.readAndParseFile("day9p1t6.txt").then(res => {
//   const icc = new IntCodeComputer({
//     name: "test6",
//     withLogger: true
//   });
//   icc.build(res);
//   let gen = icc.runInstructions();
//   const output = [];
//   let i = 0;
//   icc.addInputs(1);
//   let result = gen.next();
//   while (!result.done) {
//     i++;
//     output.push(result.value);
//     result = gen.next();
//   }
//   assert.deepEqual(output, [1]);
//   console.log("Can perform opcode 9 and input, test 6");
// });

// helpers.readAndParseFile("day9p1t5.txt").then(res => {
//   const icc = new IntCodeComputer({
//     name: "test5",
//     withLogger: true
//   });
//   icc.build(res);
//   icc.addInputs(3);
//   let gen = icc.runInstructions();
//   const output = [];
//   let i = 0;
//   let result = gen.next();
//   while (!result.done) {
//     i++;
//     output.push(result.value);
//     result = gen.next();
//   }
//   assert.deepEqual(output, [3]);
//   console.log("Can perform opcode 9 and input, test 5");
// });
