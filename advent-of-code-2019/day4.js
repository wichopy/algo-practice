// const input = '278384-824795'

let count = 0;
let string;

for (let i = 278384; i <= 824795; i++) {
  string = String(i);
  let valid = true;
  let hasDup = false;
  // console.log(i);
  for (let j = 1; j < string.length; j++) {
    if (string.charAt(j) === string.charAt(j - 1)) {
      hasDup = true;
    }
    if (string.charAt(j) < string.charAt(j - 1)) {
      // console.log("next char less then prev");
      valid = false;
      break;
    }
  }

  if (!valid) continue;

  if (!hasDup) continue;

  count++;
}

console.log(count);
