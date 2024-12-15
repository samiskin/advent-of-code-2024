import { readFileSync } from "node:fs";
import { bfs, getMapPoints, getNeighbors, hash, HashedCoord, hashToPoint, range, rotatePoint, strToGrid, walkCoordGenerator } from "./utils.ts";

const exampleInput = `
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
`;
const realInput = readFileSync("./inputs/day-12.txt", "utf-8");
const input = realInput;


const grid = strToGrid(input);
const points = getMapPoints(grid);

const groups: Set<HashedCoord>[] = [];
const visited = new Set();

for (const p of points) {
  if (visited.has(hash(p))) continue;
  const letter = grid[hash(p)];
  const group = new Set<HashedCoord>();
  group.add(hash(p));
  bfs({
    map: grid,
    start: p,
    isWall: (target) => target !== letter,
    visitor: (point) => {
      visited.add(hash(point));
      group.add(hash(point));
    },
    includeDiag: false,
  });
  groups.push(group);
}

const perimeter = (group: Set<string>) => [...group].reduce((sum, pHash) => {
  const p = hashToPoint(pHash);
  const neighbors = getNeighbors(p, false).map((n) => hash(n));
  const neighborsInGroup = neighbors.filter((n) => group.has(n));
  return 4 - neighborsInGroup.length + sum;
}, 0);

const numSides = (group: Set<string>) => {
  const points = [...group].map(hashToPoint);
  const visitedPerSide = range(4).map(() => new Set<string>());
  const dirs = getNeighbors([0, 0], false);
  let sides = 0;

  for (const p of points) {
    for (const [i, dir] of dirs.entries()) {
      if (visitedPerSide[i].has(hash(p))) continue;
      const n = [p[0] + dir[0], p[1] + dir[1]] as [number, number];
      if (!group.has(hash(n))) {
        sides += 1;
        const side1 = rotatePoint(dir, 90);
        const side2 = rotatePoint(dir, -90);
        for (const side of [side1, side2]) {
          for (const walk of walkCoordGenerator(p, side)) {
            if (hash(walk) === hash(p)) continue;
            if (!group.has(hash(walk))) break;
            const sideN = [walk[0] + dir[0], walk[1] + dir[1]] as [number, number];
            if (group.has(hash(sideN))) break;
            visitedPerSide[i].add(hash(walk));
          }
        }
      }
    }
  }

  return sides;
}

console.log(groups.reduce((acc, group) => acc + group.size * perimeter(group), 0));
console.log(groups.reduce((acc, group) => acc + group.size * numSides(group), 0));

