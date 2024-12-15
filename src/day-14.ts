import { readFileSync } from "node:fs";
import { hash, printGrid } from "./utils.ts";
import { groupBy } from "lodash-es";

const exampleInput = `
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3
`

const realInput = readFileSync("./inputs/day-14.txt", "utf-8");

// const input = exampleInput;
// const width = 11;
// const height = 7;
const input = realInput;
const width = 101;
const height = 103;

const robots = input.trim().split("\n").map((line) => {
  const [p, v] = line.split(" ").map((pair) => {
    const [, position] = pair.split("=");
    return position.split(",").map(Number) as [number, number];
  });
  return { p, v };
});
printGrid(Object.fromEntries(robots.map(({ p }) => [hash([p[0], -p[1]]), 'O'])), { ' ': '.' });

const numSeconds = 338;
const endPositions = robots.map(({ p, v }) => {
  return p.map((coord, i) => {
    const next = (coord + v[i] * numSeconds) % (i === 0 ? width : height);
    return next < 0 ? (i === 0 ? width : height) + next : next;
  });
});
const quadrants = groupBy(
  endPositions,
  ([x, y]) => {
    if (x < Math.floor(width / 2) && y < Math.floor(height / 2)) return 1;
    if (x < Math.floor(width / 2) && y > Math.floor(height / 2)) return 2;
    if (x > Math.floor(width / 2) && y < Math.floor(height / 2)) return 3;
    if (x > Math.floor(width / 2) && y > Math.floor(height / 2)) return 4;
    return "None";
});
delete quadrants["None"];
console.log(quadrants);

console.log(Object.values(quadrants).map((quad) => quad.length).reduce((acc, num) => acc * num, 1));

const calculateVariance = (points: { x: number, y: number }[]) => {
  const xMean = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const yMean = points.reduce((sum, p) => sum + p.y, 0) / points.length;
  const xSquaredDiffs = points.map(p => Math.pow(p.x - xMean, 2));
  const ySquaredDiffs = points.map(p => Math.pow(p.y - yMean, 2));
  const xVariance = xSquaredDiffs.reduce((sum, diff) => sum + diff, 0) / points.length;
  const yVariance = ySquaredDiffs.reduce((sum, diff) => sum + diff, 0) / points.length;
  const totalVariance = xVariance + yVariance;
  return totalVariance;
}


let minVariance = Infinity;
for (let i = 0; i < 100000; i++) {
  const points = robots.map(({ p, v }) => {
    const nextPos = p.map((coord, j) => {
      const next = (coord + v[j] * i) % (j === 0 ? width : height);
      return next < 0 ? (j === 0 ? width : height) + next : next;
    });
    return { x: nextPos[0], y: nextPos[1] };
  });


  const variance = calculateVariance(points);
  if (variance < minVariance) {
    console.log(variance);
    minVariance = variance;
    console.log(i);
    printGrid(Object.fromEntries(points.map((p) => [hash([p.x, -p.y]), 'O'])));
  }
}
