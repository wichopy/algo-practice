const helpers = require("../helpers");

const formatter = str => {
  console.log(str);
  return str.split("\n").map(reaction => {
    const [input, output] = reaction.split("=>");
    console.log(input, output);
    const inputArr = input.split(",");

    return [inputArr, output];
  });
};

helpers.readAndParseFile("day14.txt", formatter).then(reactions => {
  const reactionMap = {};

  const fuel = {};
  const ore = {};
  reactions.forEach(reaction => {
    const [amt, element] = reaction[1].trim().split(" ");
    reactionMap[element] = {
      amt,
      inputs: reaction[0].reduce((result, curr) => {
        const [amt, el] = curr.trim().split(" ");
        result[el] = amt;
        return result;
      }, {})
    };

    if (/ORE/.test(reaction[0])) {
      ore[element] = amt;
    }
  });

  Object.entries(reactionMap["FUEL"].inputs).forEach(entry => {
    fuel[entry[0]] = 0;
  });

  console.log(ore);
});
