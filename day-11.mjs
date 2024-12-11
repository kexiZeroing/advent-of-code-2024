import { readTextFile } from './utils.mjs';

function getNewArrangementLength(list, times) {
  for (let i = 0; i < times; i++) {
    list = list.flatMap(num => {
      if (num === 0) {
        return 1;
      }
      const numStr = num.toString();
      if (numStr.length % 2 === 0) {
        const left = Number(numStr.slice(0, numStr.length / 2))
        const right = Number(numStr.slice(numStr.length / 2))
        return [left, right];
      }
      return num * 2024;
    })
  }

  return list.length;
}

/**
 * If a number splits into two, the list size doubles.
 * 
 * Time Complexity: O(n⋅2^times)
 * Space Complexity: O(n⋅2^times)
 */

// The above function works only for small times.
// We need a better algorithm to run with bigger times.

// avoid explicitly constructing the entire list at each step
// only track how many stones of each type are present at each iteration

/**
 * Time Complexity: O(times⋅k)
 * Space Complexity: O(k)
 */
function optimizedGetNewArrangementLength(list, times) {
  let countMap = new Map();
  for (let num of list) {
    countMap.set(num, (countMap.get(num) || 0) + 1);
  }

  for (let i = 0; i < times; i++) {
    let newCountMap = new Map();

    for (let [num, count] of countMap.entries()) {
      if (num === 0) {
        // Rule 1: 0 becomes 1
        newCountMap.set(1, (newCountMap.get(1) || 0) + count);
      } else {
        const numStr = num.toString();
        if (numStr.length % 2 === 0) {
          // Rule 2: Even length number splits
          const left = Number(numStr.slice(0, numStr.length / 2));
          const right = Number(numStr.slice(numStr.length / 2));
          newCountMap.set(left, (newCountMap.get(left) || 0) + count);
          newCountMap.set(right, (newCountMap.get(right) || 0) + count);
        } else {
          // Rule 3: Multiply by 2024
          const newNum = num * 2024;
          newCountMap.set(newNum, (newCountMap.get(newNum) || 0) + count);
        }
      }
    }

    countMap = newCountMap;
  }

  let totalLength = 0;
  for (let count of countMap.values()) {
    totalLength += count;
  }

  return totalLength;
}

async function main() {
  const filePath = './day-11-input.txt';
  const fileContent = await readTextFile(filePath);

  const list = fileContent.trim().split(' ').map(Number);

  console.log('stonesAfter25Rounds result: ', getNewArrangementLength([...list], 25));
  console.log('stonesAfter75Rounds result: ', optimizedGetNewArrangementLength([...list], 75));
}

main();