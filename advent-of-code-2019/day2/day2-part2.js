const assert = require('assert')

const memory = [1, 0, 0, 3, 1, 1, 2, 3, 1, 3, 4, 3, 1, 5, 0, 3, 2, 1, 6, 19, 1, 5, 19, 23, 1, 23, 6, 27, 1, 5, 27, 31, 1, 31, 6, 35, 1, 9, 35, 39, 2, 10, 39, 43, 1, 43, 6, 47, 2, 6, 47, 51, 1, 5, 51, 55, 1, 55, 13, 59, 1, 59, 10, 63, 2, 10, 63, 67, 1, 9, 67, 71, 2, 6, 71, 75, 1, 5, 75, 79, 2, 79, 13, 83, 1, 83, 5, 87, 1, 87, 9, 91, 1, 5, 91, 95, 1, 5, 95, 99, 1, 99, 13, 103, 1, 10, 103, 107, 1, 107, 9, 111, 1, 6, 111, 115, 2, 115, 13, 119, 1, 10, 119, 123, 2, 123, 6, 127, 1, 5, 127, 131, 1, 5, 131, 135, 1, 135, 6, 139, 2, 139, 10, 143, 2, 143, 9, 147, 1, 147, 6, 151, 1, 151, 13, 155, 2, 155, 9, 159, 1, 6, 159, 163, 1, 5, 163, 167, 1, 5, 167, 171, 1, 10, 171, 175, 1, 13, 175, 179, 1, 179, 2, 183, 1, 9, 183, 0, 99, 2, 14, 0, 0]

function intcode(ints, noun = 0, verb = 99) {
  ints[1] = noun
  ints[2] = verb
  for (let i = 0; i < ints.length; i += 4) {
    let operand1 = ints[ints[i + 1]]
    let operand2 = ints[ints[i + 2]]
    let resultIndex = ints[i + 3]
    let result
    switch (ints[i]) {
      case 1:
        // add
        result = operand1 + operand2
        ints[resultIndex] = result
        break;
      case 2:
        // multiply
        result = operand1 * operand2
        ints[resultIndex] = result
        break;
      case 99:
        return ints[0]
      default:
        throw new Error('unidentified op code')
    }
  }

  return ints[0]
}

function findTarget(target, ints) {
  let noun = 0
  let verb = 99
  // Optimize: Do a binary search
  let result = 0
  while (result !== target) {
    result = intcode([...ints], noun, verb)
    if (result < target) {
      /// increase noun
      noun += 1
    } if (result > target) {
      // decrease verb
      verb -= 1
    }
  }

  // console.log(ints)
  return (100 * noun) + verb
}

// assert.equal(intcode([1, 0, 0, 0, 99]), 2)
// assert.equal(intcode([2, 3, 0, 3, 99]), 2)
// assert.equal(intcode([1, 1, 1, 4, 99, 5, 6, 0, 99]), 30)
assert.equal(findTarget(19690720, memory), 8051)