// const input = '278384-824795'

const assert = require("assert");

let count = 0;
let string;

function hasDupe(str) {
  let hasDup = false;
  let j = 0;
  while (j < str.length) {
    let count = 0;
    let num = str.charAt(j);
    while (str.charAt(j) === num) {
      j++;
      count++;
    }
    // if (count > 1 && count % 2 !== 0) return false;
    if (count === 2) hasDup = true;
  }

  return hasDup;
}

assert.equal(hasDupe("123444"), false);
assert.equal(hasDupe("124444"), false);
assert.equal(hasDupe("113334"), true);
assert.equal(hasDupe("111334"), true);
assert.equal(hasDupe("113345"), true);
assert.equal(hasDupe("111122"), true);
assert.equal(hasDupe("112233"), true);
assert.equal(hasDupe("123445"), true);
assert.equal(hasDupe("123456"), false);

function isAsc(str) {
  for (let j = 1; j < str.length; j++) {
    if (str.charAt(j) < str.charAt(j - 1)) {
      // console.log("next char less then prev");
      return false;
    }
  }

  return true;
}

assert.equal(isAsc("123456"), true);
assert.equal(isAsc("213456"), false);

for (let i = 278384; i <= 824795; i++) {
  string = String(i);
  let isAscending = isAsc(string);
  let hasDup = hasDupe(string);

  if (!isAscending) continue;

  if (!hasDup) continue;

  count++;
}

console.log(count);
