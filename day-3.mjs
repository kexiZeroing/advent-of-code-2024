import { readTextFile } from './utils.mjs';

function findMulExpressions(inputString) {
  const results = [];
  const mulRegex = /mul\((\d+),(\d+)\)/g;

  const matches = inputString.matchAll(mulRegex);
  
  for (const match of matches) {
    results.push({
      fullMatch: match[0],  // The entire mul(x,y) string
      firstNumber: parseInt(match[1]),
      secondNumber: parseInt(match[2])
    });
  }
  
  return results;
}

// I really don't figure out how to do this one. LLM helped me with this...
function calculateSum(inputString) {
  const controlRegex = /do\(\)|don't\(\)/g;
  const mulRegex = /mul\((\d+),(\d+)\)/g;

  // Get all control instruction matches
  const controlMatches = [...inputString.matchAll(controlRegex)].map(m => ({
    index: m.index,
    value: m[0]
  }));

  // Get all mul instruction matches
  const mulMatches = [...inputString.matchAll(mulRegex)].map(m => ({
    index: m.index,
    x: parseInt(m[1]),
    y: parseInt(m[2])
  }));

  // Combine both lists and sort by index
  const allMatches = [...controlMatches, ...mulMatches].sort((a, b) => a.index - b.index);

  let enabled = true; // Initial state: enabled
  let sum = 0;

  for (const match of allMatches) {
    if (match.value === 'do()') {
      enabled = true;
    } else if (match.value === "don't()") {
      enabled = false;
    } else if (match.x !== undefined && match.y !== undefined) {
      if (enabled) {
        sum += match.x * match.y;
      }
    }
  }

  return sum;
}

async function main() {
  const filePath = './day-3-input.txt';
  const fileContent = await readTextFile(filePath);

  // part 1: add up all of the results of the multiplications
  const totalAddUpMul = findMulExpressions(fileContent).reduce((total, cur) => {
    return total += cur.firstNumber * cur.secondNumber;
  }, 0);

  console.log('totalAddUpMul result: ', totalAddUpMul);

  // part 2: just the enabled multiplications
  const enabledAddUpMul = calculateSum(fileContent);

  console.log('enabledAddUpMul result: ', enabledAddUpMul);
}

main();