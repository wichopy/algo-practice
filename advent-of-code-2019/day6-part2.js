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
    this.parent = null;
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

    nodeIndex[orbitting].parent = nodeIndex[center];
    nodeIndex[center].children.push(nodeIndex[orbitting]);
  }

  const queue = [[nodeIndex["YOU"], 0]];
  let currentNode;
  let currentLength;

  const visited = {
    YOU: true
  };

  while (queue.length) {
    // BFS  the children and parents from the start node.
    [currentNode, currentLength] = queue.shift();
    visited[currentNode.val] = true;
    if (currentNode.val === "SAN") {
      // Remove the orbits from YOU to planet and SAN to planet
      return currentLength - 2;
    }
    if (currentNode.parent && !visited[currentNode.parent.val]) {
      queue.push([currentNode.parent, currentLength + 1]);
    }
    for (let child of currentNode.children) {
      if (!visited[child.val]) {
        queue.push([child, currentLength + 1]);
      }
    }
  }

  throw new Error("Could not find SAN");
}

main("day6.txt").then(result => {
  console.log(result);
});
