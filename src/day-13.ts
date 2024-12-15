import { readFileSync } from "node:fs";
import { lcm } from "./utils.ts";

const exampleInput = `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
`

const realInput = readFileSync("./inputs/day-13.txt", "utf-8");
const input = realInput;


const parsed = input.trim().split("\n\n").map((section) => {
  const [a, b] = section.split("\n").slice(0, 2).map((line) => {
    const [x, y] = line.split(", ").map((coord) => coord.split("+")[1]);
    return [Number(x), Number(y)];
  });
  const prize = section.split("\n")[2].split(", ").map((coord) => coord.split("=")[1]).map(Number);
  return { a, b, prize };
});

let totalTokens = 0;

// ax + by = c
// dx + ey = f
const solveSystem = (a: number, b: number, c: number, d: number, e: number, f: number) => {
  const x = (c - (b * f)/e) / (a - (b*d)/e)
  const y = (f - d * x) / e
  return [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
}

for (const { a, b, prize } of parsed) {
  // let minTokens = Infinity;
  // let aPress, bPress;
  // for (let numBPress = 0; numBPress < 100; numBPress++) {
  //   let xb = b[0] * numBPress;
  //   let yb = b[1] * numBPress;
  //   let xLeft = prize[0] - xb;
  //   let yLeft = prize[1] - yb;
  //   if (xLeft % a[0] === 0 && yLeft % a[1] === 0) {
  //     const numAPress = xLeft / a[0];
  //     if (numAPress === yLeft / a[1]) {
  //       minTokens = Math.min(minTokens, numAPress * 3 + numBPress);
  //       aPress = numAPress;
  //       bPress = numBPress;
  //     }
  //   }
  // }

  // if (minTokens !== Infinity) {
  //   totalTokens += minTokens;
  // }

  prize[0] += 10000000000000;
  prize[1] += 10000000000000;

  const [x, y] = solveSystem(a[0], b[0], prize[0], a[1], b[1], prize[1]);
  if (x % 1 !== 0 || y % 1 !== 0 || x < 0 || y < 0) {
    continue;
  }

  totalTokens += x * 3 + y;
}

console.log(totalTokens);
