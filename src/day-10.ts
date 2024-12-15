import { readFileSync } from "node:fs";
import { bfs, hash, hashToPoint, strToGrid } from "./utils.ts";
import { mapValues } from "lodash-es";

const exampleInput = `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`;
const realInput = readFileSync("./inputs/day-10.txt", "utf-8");
const input = realInput;

const grid = mapValues(strToGrid(input), Number);
const trailheads = Object.entries(grid).filter(([, value]) => value === 0).map(([point]) => point).map(hashToPoint);

const scores = trailheads.map((trailhead) => {
  let summits = new Set();
  let summitPaths = 0;
  bfs({
    allowRevisits: true,
    map: grid, 
    start: trailhead, 
    isWall: (target, self) => {
      return target !== self + 1;
    }, 
    visitor: (point) => {
      if (grid[hash(point)] === 9) {
        summits.add(hash(point));
        summitPaths++;
      }
    }
  });

  return [summits.size, summitPaths];
});

console.log(scores.reduce((acc, [score]) => acc + score, 0));
console.log(scores.reduce((acc, [_, score]) => acc + score, 0));


