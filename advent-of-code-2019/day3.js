var fs = require('fs');

/*

The unoptimized approach to this question after parsing the wires file to a list of point tuples is to:
  - sort the wire segments in asc order closest to the origin for each wire
  - compare each segment with all the segments in the other wire
  - The first intersection we find will be the closest one since we sorted.

Did not implement but to optimize, we could use a sweeping intersection algorithm.
  - First sweep from origin L to R until we find the first intersection.
  - Then sweep from origin R to L.
  - Then sweep from origin B to T
  - Then sweep from origin T to B
  - The smaller of these 4 intersections will be the closest point.
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

function manhattanDistance(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
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

function sortByManhattan(a, b) {
  return (manhattanDistance([0, 0], a[0]) + manhattanDistance([0, 0], a[1])) - (manhattanDistance([0, 0], b[0]) + manhattanDistance([0, 0], b[1]))
}

async function main(filename) {
  const input = fs.createReadStream(filename);
  const wireList = await readLines(input)

  const wires = []
  for (let wire of wireList) {
    const lines = []
    let start = [0, 0]
    for (let direction of wire) {
      let end = [...start]
      switch (direction.charAt(0)) {
        case 'R':
          end[0] = start[0] + Number(direction.substring(1))
          break;
        case 'L':
          end[0] = start[0] - Number(direction.substring(1))
          break;
        case 'D':
          end[1] = start[1] - Number(direction.substring(1))
          break;
        case 'U':
          end[1] = start[1] + Number(direction.substring(1))
          break;
      }

      lines.push([start, end])

      start = [...end]
    }
    wires.push(lines)
  }

  const wire1 = wires[0]
  const wire2 = wires[1]

  wire1.sort(sortByManhattan)
  wire2.sort(sortByManhattan)

  for (let segment1 of wire1) {
    for (let segment2 of wire2) {
      let intersect = intersectSegments(...segment1, ...segment2)
      if (!intersect) continue
      if ((intersect[0] === 0 && intersect[1] === 0)) continue

      return manhattanDistance([0, 0], intersect)
    }
  }
}

main('day3-test1.txt').then(res => console.log(res))
main('day3.txt').then(res => console.log(res))