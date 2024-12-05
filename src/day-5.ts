import { isEqual } from "lodash-es";
import { readFileSync } from "node:fs";

const exampleInput = `
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
`;
const realInput = readFileSync("./inputs/day-5.txt", "utf-8");

const input = realInput;

const [orderings, pages] = input.split("\n\n");

const orderingsArray = orderings
  .trim()
  .split("\n")
  .map((line) => line.split("|").map(Number));
const pagesArray = pages
  .trim()
  .split("\n")
  .map((line) => line.split(",").map(Number));

const orderingsMap = new Map<number, number[]>();
for (const [prev, next] of orderingsArray) {
  if (!orderingsMap.has(prev)) {
    orderingsMap.set(prev, []);
  }
  orderingsMap.get(prev)!.push(next);
}

const customComparator = (a: number, b: number) => {
  if (orderingsMap.get(a)?.includes(b)) {
    return -1;
  } else if (orderingsMap.get(b)?.includes(a)) {
    return 1;
  }
  return 0;
};

const sortedPagesArray = pagesArray.map((pages) =>
  [...pages].sort(customComparator)
);

const validPages = pagesArray.filter((pages, i) =>
  isEqual(pages, sortedPagesArray[i])
);
const invalidPages = pagesArray.filter(
  (pages, i) => !isEqual(pages, sortedPagesArray[i])
);

const p1 = validPages
  .map((pages) => pages[Math.floor(pages.length / 2)])
  .reduce((acc, curr) => acc + curr, 0);

const p2 = invalidPages
  .map((pages) => pages.sort(customComparator))
  .map((pages) => pages[Math.floor(pages.length / 2)])
  .reduce((acc, curr) => acc + curr, 0);

console.log(p1, p2);
