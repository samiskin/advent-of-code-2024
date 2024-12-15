import { partition } from "lodash-es";
import { readFileSync } from "node:fs";

const exampleInput = `
2333133121414131402
`;
const realInput = readFileSync("./inputs/day-9.txt", "utf-8");
const input = realInput;

const numbers = input.trim().split("").map(Number);

const disk = [];
for (let i = 0; i < input.length; i++) {
  const isBlock = i % 2 === 0;
  for (let j = 0; j < numbers[i]; j++) {
    disk.push(
      isBlock ? i / 2 : null
    );
  }
}

let nextSpaceP1 = 0;
let nextBlockP1 = disk.length - 1;
let p1Disk = [...disk];

while (nextSpaceP1 < nextBlockP1) {
  while (p1Disk[nextSpaceP1] !== null) {
    nextSpaceP1++;
  }
  while (p1Disk[nextBlockP1] === null) {
    nextBlockP1--;
  }
  if (nextSpaceP1 < nextBlockP1) {
    p1Disk[nextSpaceP1] = p1Disk[nextBlockP1];
    p1Disk[nextBlockP1] = null;
  }
  nextSpaceP1++;
  nextBlockP1--;
}


let p1Checksum = 0;
for (let i = 0; i < disk.length; i++) {
  if (p1Disk[i] !== null) {
    p1Checksum += i * p1Disk[i]!;
  }
}

console.log(p1Checksum);


// --------------------

const blocks = numbers.reduce((acc, blockLength, i) => {
  const id = i % 2 === 0 ? i / 2 : null;
  const index = (acc[acc.length - 1]?.index ?? 0) + (acc[acc.length - 1]?.length ?? 0);
  return acc.concat({ id, index, length: blockLength });
}, [] as { id: number | null, index: number, length: number }[]);

const [files, spaces] = partition(blocks, (block) => block.id !== null);

files.reverse();
for (const file of files) {
  const space = spaces.find((space) => space.length >= file.length && space.index <= file.index);
  if (space) {
    file.index = space.index;
    space.length -= file.length;
    space.index += file.length;
  }
}

let p2Checksum = 0;
for (const file of files) {
  for (let i = 0; i < file.length; i++) {
    p2Checksum += file.id! * (i + file.index);
  }
}
console.log(p2Checksum);















