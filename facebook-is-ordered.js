const assert = require('assert')

function isSorted(words, order) {
  for (let i = 1; i < words.length; i++) {
    console.log('compare', words[i - 1], words[i])
    if (!isOrdered(words[i - 1], words[i], order)) {
      return false
    }
  }

  return true
}

function isOrdered(left, right, order) {
  let i = 0
  let j = 0

  while (i < left.length || j < right.length) {
    console.log(i, j, left.charAt(i), right.charAt(j))
    if (left.charAt(i) === right.charAt(j)) {
      i++
      j++

      continue
    }
    if (order.indexOf(left.charAt(i)) < order.indexOf(right.charAt(j))) {
      return true
    }

    if (order.indexOf(left.charAt(i)) > order.indexOf(right.charAt(j))) {
      return false
    } else if (left.charAt(i) !== '' && right.charAt(j) === '') {
      return false
    }

    i++
    j++
  }

  return true
}

const words = ['aa', 'ab', 'ac', 'b', 'cb']
const order = ['a', 'b', 'c']

console.log(isSorted(words, order))