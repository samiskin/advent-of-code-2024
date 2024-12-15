
import { memoize } from "lodash-es";
import { readFileSync } from "node:fs";
const exampleInput = `
125 17
`;
const realInput = readFileSync("./inputs/day-11.txt", "utf-8");
const input = realInput;
const stones = input.trim().split(" ").map(Number);

const numStones = memoize((stone: number, remainingBlinks: number): number => {
  if (remainingBlinks === 0) return 1;
  if (stone === 0) return numStones(1, remainingBlinks - 1);
  if (String(stone).length % 2 === 0) {
    const left = Number(String(stone).slice(0, String(stone).length / 2));
    const right = Number(String(stone).slice(String(stone).length / 2));
    return numStones(left, remainingBlinks - 1) + numStones(right, remainingBlinks - 1);
  }
  return numStones(stone * 2024, remainingBlinks - 1);
}, (...args) => args.join(","));

console.log(stones.reduce((acc, stone) => acc + numStones(stone, 25), 0));
console.log(stones.reduce((acc, stone) => acc + numStones(stone, 75), 0));
