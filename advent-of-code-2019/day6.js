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

async function main(filename) {
  const input = fs.createReadStream(filename);
  const orbits = await readLines(input);
  console.log(orbits);
}

main("day6.txt");
