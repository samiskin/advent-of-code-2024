import { range, zip } from "lodash-es";
import { readFileSync } from "node:fs";

const exampleTxt = `
xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))
`;
const realTxt = readFileSync("./inputs/day-3.txt", "utf-8");

const input = exampleTxt;

const muls = Array.from(input.matchAll(/mul\((\d+),(\d+)\)/g)).map((m) => ({
  index: m.index,
  a: m[1],
  b: m[2],
}));

const doMuls = Array.from(input.matchAll(/do\(\)/g)).map((m) => m.index);
const dontMuls = Array.from(input.matchAll(/don't\(\)/g)).map((m) => m.index);
const isActive = range(input.length).map((i) => {
  const priorDo = doMuls.findLast((doIndex) => doIndex < i) || 0;
  const priorDont = dontMuls.findLast((dontIndex) => dontIndex < i) || -1;
  if (priorDont > priorDo) return false;
  return true;
});

const activeMuls = muls.filter((a) => isActive[a.index]);
console.log(
  muls.map((a) => Number(a.a) * Number(a.b)).reduce((a, b) => a + b, 0)
);
console.log(
  activeMuls.map((a) => Number(a.a) * Number(a.b)).reduce((a, b) => a + b, 0)
);
