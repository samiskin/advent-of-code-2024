import { readFileSync } from "node:fs";
import { arrayPairs, getMapPoints, hash, printGrid, strToGrid } from "./utils.ts";
import { groupBy, uniq } from "lodash-es";

const exampleInput = `
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
`;

const realInput = readFileSync("./inputs/day-8.txt", "utf-8");

const input = realInput;

const grid = strToGrid(input);
const points = getMapPoints(grid);
const antennas = groupBy(points, (point) => grid[hash(point)]);
delete antennas["."];

const antinodes = Object.entries(antennas).map(([antenna, points]) => {
  const antennaPairs = arrayPairs(points);
  const antinodes = antennaPairs.flatMap(([a, b]) => {
    const distance = [(a[0] - b[0]), (a[1] - b[1])];
    const extendFromA = [a[0] + distance[0], a[1] + distance[1]];
    const extendFromB = [b[0] - distance[0], b[1] - distance[1]];
    return [extendFromA, extendFromB] as [
      [number, number],
      [number, number],
    ];
  });
  return antinodes.filter((node) => grid[hash(node)]);
});

console.log(uniq(antinodes.flat().map(hash)).length);


const antinodes2 = Object.entries(antennas).map(([antenna, points]) => {
  const antennaPairs = arrayPairs(points);
  const antinodes = antennaPairs.flatMap(([a, b]) => {
    const distance = [(a[0] - b[0]), (a[1] - b[1])];
    const nodes = [];
    for (const dir of [-1, 1]) {
      for (const node of [a, b]) {
        for (let extend = node; grid[hash(extend)];) {
          extend = [extend[0] + distance[0] * dir, extend[1] + distance[1] * dir];
          nodes.push(extend);
        }
      }
    }
    return nodes as [number, number][];
  });
  return antinodes.filter((node) => grid[hash(node)]);
});

console.log(uniq(antinodes2.flat().map(hash)).length);