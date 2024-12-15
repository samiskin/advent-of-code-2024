import { readFileSync } from "node:fs";
import { hash, HashedCoord, hashToPoint, printGrid, strToGrid } from "./utils.ts";

const exampleInput = `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`;

const realInput = readFileSync("./inputs/day-15.txt", "utf-8");
const input = realInput;

const [ gridStr, movesStr ] = input.split("\n\n").map(s => s.trim());

const moves = movesStr.split("\n").flatMap(s => s.split("").map(s => ({
  '<': [-1, 0],
  '>': [1, 0],
  '^': [0, 1],
  v: [0, -1],
})[s]! as [number, number]));

const grid = strToGrid(gridStr);

// const start = hashToPoint(Object.entries(grid).find(([_, v]) => v === '@')?.[0]!);

// const moveBox = (pos: [number, number], dir: [number, number]) => {
//   const newPos = [pos[0] + dir[0], pos[1] + dir[1]] as [number, number];
//   if (grid[hash(newPos)] === '#') {
//     return pos;
//   } else if (grid[hash(newPos)] === 'O') {
//     moveBox(newPos, dir);
//   }

//   if (grid[hash(newPos)] === '.') {
//     grid[hash(newPos)] = 'O';
//     grid[hash(pos)] = '.';
//   }
// }


// let current = start;
// console.log(grid[hash(current)]);
// let i = 0;
// for (const move of moves) {
//   // console.log("Moving", move);
//   const newPos = [current[0] + move[0], current[1] + move[1]] as [number, number];
//   if (grid[hash(newPos)] === '#') {
//     continue;
//   } else if (grid[hash(newPos)] === 'O') {
//     moveBox(newPos, move);
//   }
//   if (grid[hash(newPos)] === '.') {
//     grid[hash(newPos)] = '@';
//     grid[hash(current)] = '.';
//   current = newPos;
//   }
// }

// const boxPos = Object.entries(grid).filter(([_, v]) => v === 'O').map(([k]) => hashToPoint(k));
// const boxPoints = boxPos.map(([x, y]) => 100 * Math.abs(y) + x).reduce((a, b) => a + b, 0);
// console.log(boxPoints);


let expandedGrid = Object.fromEntries(Object.entries(grid).flatMap(([k, v]) => {
  const [x, y] = hashToPoint(k);
  if (v === "#" || v === '.') {
    return [
      [hash([x * 2, y]), v],
      [hash([x * 2 + 1, y]), v],
    ]
  } else if (v === '@') {
    return [
      [hash([x * 2, y]), '@'],
      [hash([x * 2 + 1, y]), '.'],
    ]
  } else if (v === 'O') {
    return [
      [hash([x * 2, y]), '['],
      [hash([x * 2 + 1, y]), ']'],
    ]
  }
  return [];
}));

const start = hashToPoint(Object.entries(expandedGrid).find(([_, v]) => v === '@')?.[0]!);

const moveBox = (grid: Record<HashedCoord, string>, pos: [number, number], dir: [number, number]): boolean => {
  const val = grid[hash(pos)];
  const otherBoxPos = (val === '[' ? [pos[0] + 1, pos[1]] : [pos[0] - 1, pos[1]]) as [number, number];
  const nextPos = [pos[0] + dir[0], pos[1] + dir[1]] as [number, number];
  const otherNextPos = [otherBoxPos[0] + dir[0], otherBoxPos[1] + dir[1]] as [number, number];
  if (grid[hash(nextPos)] === '#' || grid[hash(otherNextPos)] === '#') {
    return false;
  } 
  if (dir[0] === -1 && val === ']') {
    return moveBox(grid, otherBoxPos, dir);
  } else if (dir[0] === 1 && val === '[') {
    return moveBox(grid, otherBoxPos, dir);
  } 
  if (grid[hash(nextPos)] === ']' || grid[hash(nextPos)] === '[') {
    if (!moveBox(grid, nextPos, dir)) {
      return false;
    }
  }
  if ((dir[1] === -1 || dir[1] === 1) && (grid[hash(otherNextPos)] === '[' || grid[hash(otherNextPos)] === ']')) {
    if (!moveBox(grid, otherNextPos, dir)) {
      return false;
    }
  }
  if (grid[hash(nextPos)] === '.' && (hash(otherNextPos) === hash(pos) || grid[hash(otherNextPos)] === '.')) {
    grid[hash(pos)] = '.';
    grid[hash(otherBoxPos)] = '.';
    grid[hash(nextPos)] = val;
    grid[hash(otherNextPos)] = val === '[' ? ']' : '[';
    return true;
  }

  return false;
}

printGrid(expandedGrid);
let current = start;
let count = 0;
for (const move of moves) {
  const newPos = [current[0] + move[0], current[1] + move[1]] as [number, number];
  if (expandedGrid[hash(newPos)] === '#') {
    continue;
  } else if (expandedGrid[hash(newPos)] === '[' || expandedGrid[hash(newPos)] === ']') {
    const tempGrid = Object.fromEntries(Object.entries(expandedGrid));
    const canMove = moveBox(tempGrid, newPos, move);
    if (canMove) {
      expandedGrid = tempGrid;
    }
  }
  if (expandedGrid[hash(newPos)] === '.') {
    expandedGrid[hash(newPos)] = '@';
    expandedGrid[hash(current)] = '.';
    current = newPos;
  }
}


printGrid(expandedGrid);
const boxPos = Object.entries(expandedGrid).filter(([_, v]) => v === '[').map(([k]) => hashToPoint(k));
const boxPoints = boxPos.map(([x, y]) => 100 * Math.abs(y) + x).reduce((a, b) => a + b, 0);
console.log(boxPoints);
