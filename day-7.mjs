import { readTextFile } from './utils.mjs';

function checkIsValid(testValue, numbers, withConcat = false) {
  let possibleResults = new Set();
  possibleResults.add(numbers[0]);
  
  for (let i = 1; i < numbers.length; i++) {
    const currentNumber = numbers[i];
    const nextResults = new Set();
      
    for (const result of possibleResults) {
      nextResults.add(result + currentNumber);
      nextResults.add(result * currentNumber);

      if (withConcat) {
        // concat 10 || 23 -> 1023
        const concatenated = parseInt(result.toString() + currentNumber.toString(), 10);
        nextResults.add(concatenated);
      }
    }
    possibleResults = nextResults;
  }
  
  return possibleResults.has(testValue);
}

async function main() {
  const filePath = './day-7-input.txt';
  const fileContent = await readTextFile(filePath);

  const equations = fileContent.trim().split('\n').map(line => {
    return line.trim().split(': ');
  }).map(equation => {
    return [Number(equation[0]), equation[1].trim().split(' ').map(Number)];
  })

  // part 1: total valid calibration result
  const validEquations = equations.filter(equation => {
    return checkIsValid(equation[0], equation[1]);
  });
  const validTotal = validEquations.reduce((total, cur) => {
    return total += cur[0];
  }, 0);

  console.log('validTotal result: ', validTotal);

  // part 2: total valid result with concatenation
  const validEquationsWithConcat = equations.filter(equation => {
    return checkIsValid(equation[0], equation[1], true);
  });
  const validTotalWithConcat = validEquationsWithConcat.reduce((total, cur) => {
    return total += cur[0];
  }, 0);

  console.log('validTotalWithConcat result: ', validTotalWithConcat);
}

main();