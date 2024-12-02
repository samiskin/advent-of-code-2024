import { range, zip } from "lodash-es";
import { readFileSync } from "node:fs";
const exampleTxt = `

7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9

`;
const realTxt = readFileSync("./inputs/day-2.txt", "utf-8");

const input = realTxt;

const lines = input
  .trim()
  .split("\n")
  .map((line) => line.split(/\s+/).map(Number));

const isLineSafe = (line: number[]) => {
  const pairs = zip(line.slice(0, -1), line.slice(1));
  const increasing = pairs.every(([a, b]) => a! < b!);
  const decreasing = pairs.every(([a, b]) => a! > b!);
  const noBigJumps = pairs.every(([a, b]) => Math.abs(a! - b!) <= 3);
  return (increasing || decreasing) && noBigJumps;
};

// 680
console.log("Part 1:", lines.filter(isLineSafe).length);

const permutationsWithOneMissing = lines.map((line) => {
  return range(0, line.length).map((i) => line.filter((_, j) => j !== i));
});

const safeLines = permutationsWithOneMissing.map((permutations) => {
  return permutations.find(isLineSafe);
});

// 710
console.log("Part 2:", safeLines.filter(Boolean).length);
