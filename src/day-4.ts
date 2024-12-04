import { range, zip } from "lodash-es";
import { readFileSync } from "node:fs";
import {
  getDimensions,
  getMapPoints,
  getNeighbors,
  hash,
  inBounds,
  printGrid,
  strToGrid,
  walkCoords,
  walkDirs,
} from "./utils.ts";

const exampleTxt = `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`;
const realTxt = readFileSync("./inputs/day-4.txt", "utf-8");

const input = realTxt;

const grid = strToGrid(input);
const dirs = walkDirs([0, 0], 3, true);
const mapPoints = getMapPoints(grid);

const xmases = mapPoints
  .flatMap(([x, y]) =>
    dirs.map((dir) =>
      dir.map(([dx, dy]) => grid[hash([x + dx, y + dy])]).join("")
    )
  )
  .filter((str) => str === "XMAS").length;

const downRight = walkCoords([0, 0], [1, -1], 2);
const downLeft = walkCoords([2, 0], [-1, -1], 2);
const xmases2 = mapPoints
  .map(([x, y]) => [
    downRight.map(([dx, dy]) => grid[hash([x + dx, y + dy])] || ".").join(""),
    downLeft.map(([dx, dy]) => grid[hash([x + dx, y + dy])] || ".").join(""),
  ])
  .filter((values) =>
    values.every((str) => str === "MAS" || str === "SAM")
  ).length;

console.log(xmases, xmases2);
