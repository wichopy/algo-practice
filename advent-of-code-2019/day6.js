var fs = require("fs");

function readLines(input) {
  return new Promise((res, rej) => {
    let orbits = [];
    let string = "";
    input.on("data", function(data) {
      string += data;
      orbits = string.split("\n");
    });

    input.on("end", function() {
      res(orbits);
    });
  });
}

class Node {
  constructor(val) {
    this.val = val;
    this.children = [];
  }
}

async function main(filename) {
  const input = fs.createReadStream(filename);
  const orbits = await readLines(input);

  const nodeIndex = {};
  function findRoot(nodeIndex) {
    return nodeIndex["COM"];
  }

  for (let orbit of orbits) {
    const [center, orbitting] = orbit.split(")");

    if (!nodeIndex[center]) {
      nodeIndex[center] = new Node(center);
    }

    if (!nodeIndex[orbitting]) {
      nodeIndex[orbitting] = new Node(orbitting);
    }

    nodeIndex[center].children.push(nodeIndex[orbitting]);
  }

  const root = findRoot(nodeIndex);
  const stack = [[root, 0]];
  let orbitLength = 0;
  let currentNode;
  let currentLength;
  while (stack.length) {
    [currentNode, currentLength] = stack.pop();

    orbitLength += currentLength;

    for (let child of currentNode.children) {
      stack.push([child, currentLength + 1]);
    }
  }

  return orbitLength;
}

main("day6.txt").then(result => {
  console.log(result);
});
