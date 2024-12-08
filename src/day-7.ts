import { readFileSync } from "node:fs";

const exampleInput = `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`;

const realInput = readFileSync("./inputs/day-7.txt", "utf-8");

const input = exampleInput;

const lines = input
  .trim()
  .split("\n")
  .map((line) => line.split(": "))
  .map(([sum, nums]) => ({
    sum: Number(sum),
    nums: nums.split(" ").map(Number),
  }));

const calcResults = (nums: number[], allowConcat = false): number[] => {
  if (nums.length === 1) return [nums[0]];
  const [first, second, ...rest] = nums;
  const paths = [
    [first + second, ...rest],
    [first * second, ...rest],
  ];

  if (allowConcat) {
    paths.push([Number(first.toString() + second.toString()), ...rest]);
  }

  return paths.flatMap((path) => calcResults(path, allowConcat));
};

const p1 = lines.filter((line) => calcResults(line.nums).includes(line.sum)).reduce((acc, line) => acc + line.sum, 0);
const p2 = lines.filter((line) => calcResults(line.nums, true).includes(line.sum)).reduce((acc, line) => acc + line.sum, 0);

console.log(p1, p2);