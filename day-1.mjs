import fs from 'fs/promises';
import path from 'path';

async function readTextFile(filePath) {
  try {
    const resolvedPath = path.resolve(filePath);
    const fileContent = await fs.readFile(resolvedPath, 'utf-8');
    
    return fileContent;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
}

function countOccurrencesMap(arr) {
  const occurrenceMap = new Map();
  
  for (const num of arr) {
    occurrenceMap.set(num, (occurrenceMap.get(num) || 0) + 1);
  }
  
  return occurrenceMap;
}

async function main() {
  const filePath = './day-1-input.txt';
  const fileContent = await readTextFile(filePath);

  const numberPairs = fileContent.trim().split('\n').map(line => {
    const [column1, column2] = line.trim().split(/\s+/).map(Number);
    return [column1, column2];
  });

  const orderedFirstColumn = numberPairs.map(pair => pair[0]).sort((a, b) => a - b);
  const orderedSecondColumn = numberPairs.map(pair => pair[1]).sort((a, b) => a - b);

  // part 1: total distance 
  const columnDifference = orderedFirstColumn.map((value, index) => {
    const secondColumnValue = orderedSecondColumn[index];
    return Math.abs(secondColumnValue - value);
  });

  const totalDifference = columnDifference.reduce((total, cur) => total + cur, 0);
  console.log("result1: ", totalDifference);

  // part 2: similarity score
  const occurrenceMap = countOccurrencesMap(orderedSecondColumn);
  let totalScore = 0;

  for (let i = 0; i < orderedFirstColumn.length; i++) {
    const num = orderedFirstColumn[i];
    totalScore += num * (occurrenceMap.get(num) ?? 0);
  }

  console.log("result2: ", totalScore);
}

main()