import { uniq } from "lodash-es";
import { readFileSync } from "node:fs";
import { hash, HashedCoord, hashToPoint, rotatePoint, strToGrid } from "./utils.ts";

const exampleInput = `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`;

const realInput = readFileSync("./inputs/day-6.txt", "utf-8");

const input = realInput;

const grid = strToGrid(input);

const start = hashToPoint(Object.entries(grid).find(([_, val]) => val === "^")?.[0]!);

const walk = (start: [number, number], startDir: [number, number]) => {
  let pos = start;
  let dir = startDir;
  const seen = new Set<string>();
  const path: HashedCoord[] = [];

  while (!seen.has(`${hash(pos)}_${hash(dir)}`) && grid[hash(pos)]) {
    path.push(hash(pos));
    seen.add(`${hash(pos)}_${hash(dir)}`);
    let nextPos = [dir[0] + pos[0], dir[1] + pos[1]] as [number, number];
    while (grid[hash(nextPos)] === "#") {
      dir = rotatePoint(dir, 90);
      nextPos = [dir[0] + pos[0], dir[1] + pos[1]] as [number, number];
    }
    pos = nextPos;
  }
  return [uniq(path), !!grid[hash(pos)]] as [typeof path, boolean];
}

const [path] = walk(start, [0, 1]);
const loops = path.slice(1).reduce((acc, point) => {
  grid[point] = "#";
  const doesLoop = walk(start, [0, 1])[1];
  grid[point] = ".";
  return acc + (doesLoop ? 1 : 0);
}, 0);

console.log(path.length);
console.log(loops);