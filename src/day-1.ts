import { zip } from "lodash-es";
import { readFileSync } from "node:fs";
import { expect } from "./utils.ts";

const exampleTxt = `
3   4
4   3
2   5
1   3
3   9
3   3
`;

const realTxt = readFileSync("./inputs/day-1.txt", "utf-8");

let txt = realTxt;

const lines = txt
  .trim()
  .split("\n")
  .map((line) => line.split(/\s+/).map(Number));

const [left, right] = lines
  .reduce((acc, [l, r]) => (acc[0].push(l), acc[1].push(r), acc), [[], []] as [
    Array<number>,
    Array<number>,
  ])
  .map((arr) => arr.sort((a, b) => a - b));
const differences = zip(left, right).map(([l, r]) => Math.abs(r! - l!));

const part1 = differences.reduce((acc, d) => acc + d, 0);
console.log("Part 1:", part1);
expect(part1).toBe(1319616);

const rightFrequencies = right.reduce(
  (acc, r) => {
    acc[r] = (acc[r] || 0) + 1;
    return acc;
  },
  {} as Record<number, number>
);

const leftSimilarities = left.map((l) => l * (rightFrequencies[l] || 0));

const part2 = leftSimilarities.reduce((acc, s) => acc + s, 0);
console.log("Part 2:", part2);
expect(part2).toBe(27267728);
