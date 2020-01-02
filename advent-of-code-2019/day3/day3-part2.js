const fs = require('fs');
const assert = require('assert')
/*
The approach to finding the minimal distance to intersection is storing the number of steps taken so far to reach the start point of a line segment and the direction.
No sorting will be done to find the intersections since we need to maiantain the order.

When the first intersection is encountered, take the stepsSoFar for each wire, and add to it the number of steps to get to the intersection.
This value can then be returned since the first intersection we find should equal the shortest steps to an intersection.
*/

// https://stackoverflow.com/questions/6831918/node-js-read-a-text-file-into-an-array-each-line-an-item-in-the-array
function readLines(input) {
  return new Promise((res, rej) => {

    var remaining = '';
    const wires = []
    let file = ''
    input.on('data', function (data) {
      file += data;
      const parts = file.split('\n')
      for (let part of parts) {
        remaining = part
        let wire = []
        var index = remaining.indexOf(',');

        var last = 0;
        while (index > -1) {
          var line = remaining.substring(last, index);
          last = index + 1;
          wire.push(line)
          index = remaining.indexOf(',', last);
        }

        remaining = remaining.substring(last);
        wire.push(remaining)
        wires.push(wire)
      }
    });

    input.on('end', function () {
      if (remaining.length > 0) {
        res(wires)
      }
    });
  })
}

// https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
function intersectSegments(a, b, c, d) {
  let s1x = b[0] - a[0]
  let s1y = b[1] - a[1]
  let s2x = d[0] - c[0]
  let s2y = d[1] - c[1]

  let s = (-s1y * (a[0] - c[0]) + s1x * (a[1] - c[1])) / (-s2x * s1y + s1x * s2y)
  let t = (s2x * (a[1] - c[1]) - s2y * (a[0] - c[0])) / (-s2x * s1y + s1x * s2y)

  // Collision detected
  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    return [a[0] + (t * s1x), a[1] + (t * s1y)];
  }

  return null; // No collision
}

function stepsToIntersection(intersect, startPoint, direction) {
  let result
  const [x, y] = startPoint
  const [ix, iy] = intersect
  switch (direction) {
    case 'D':
      result = y - iy
      break
    case 'U':
      result = iy - y
      break
    case 'R':
      result = ix - x
      break
    case 'L':
      result = x - ix
      break
  }
  return result
}

function updateEnd(end, direction) {
  switch (direction.charAt(0)) {
    case 'R':
      end[0] = end[0] + Number(direction.substring(1))
      break;
    case 'L':
      end[0] = end[0] - Number(direction.substring(1))
      break;
    case 'D':
      end[1] = end[1] - Number(direction.substring(1))
      break;
    case 'U':
      end[1] = end[1] + Number(direction.substring(1))
      break;
  }
}

async function main(filename) {
  const input = fs.createReadStream(filename);
  const wireList = await readLines(input)

  const wires = []
  for (let wire of wireList) {
    const lines = []
    let start = [0, 0]
    let numStepsSoFar = 0
    for (let direction of wire) {
      let end = [...start]
      updateEnd(end, direction)
      lines.push([start, end, numStepsSoFar, direction.charAt(0)])
      numStepsSoFar += Number(direction.substring(1))
      start = [...end]
    }
    wires.push(lines)
  }

  const wire1 = wires[0]
  const wire2 = wires[1]

  for (let segment1 of wire1) {
    for (let segment2 of wire2) {
      const [seg1p1, seg1p2, seg1stepsSoFar, seg1Direction] = segment1
      const [seg2p1, seg2p2, seg2stepsSoFar, seg2Direction] = segment2
      let intersect = intersectSegments(seg1p1, seg1p2, seg2p1, seg2p2)
      if (!intersect) continue
      if ((intersect[0] === 0 && intersect[1] === 0)) continue

      let totalStepsToIntercept = (
        stepsToIntersection(intersect, seg1p1, seg1Direction) + seg1stepsSoFar
        +
        stepsToIntersection(intersect, seg2p1, seg2Direction) + seg2stepsSoFar
      )

      return totalStepsToIntercept
    }
  }
}

main('day3-test1.txt').then(res => {
  console.log(res)
  assert.equal(res, 30)
})
main('day3.txt').then(res => {
  console.log(res)
  assert.equal(res, 14012)
})