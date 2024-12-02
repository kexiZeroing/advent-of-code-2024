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

function checkArrayConditions(arr) {
  if (arr.length < 2) return true;
  
  const isValidDifference = (a, b) => Math.abs(a - b) >= 1 && Math.abs(a - b) <= 3;

  let isIncreasing = true;
  let isDecreasing = true;

  for (let i = 1; i < arr.length; i++) {
    if (!isValidDifference(arr[i - 1], arr[i])) {
      return false;
    }

    if (arr[i] > arr[i - 1]) {
      isDecreasing = false;
    }
    if (arr[i] < arr[i - 1]) {
      isIncreasing = false;
    }
  }

  return isIncreasing || isDecreasing;
}

function tolerateCheckArray(arr) {
  if (arr.length < 2) return true;

  if (checkArrayConditions(arr)) return true;

  // Check if removing one element makes it valid
  for (let i = 0; i < arr.length; i++) {
    const subArray = arr.slice(0, i).concat(arr.slice(i + 1));
    if (checkArrayConditions(subArray)) {
      return true;
    }
  }

  return false;
}

async function main() {
  const filePath = './day-2-input.txt';
  const fileContent = await readTextFile(filePath);

  const reports = fileContent.trim().split('\n').map(line => {
    return line.trim().split(/\s+/).map(Number);
  });

  // part 1: safe reports
  const safeReportCount = reports.filter(report => checkArrayConditions(report)).length
  console.log("result: ", safeReportCount);

  // part 2: remove one to make it safe
  const tolerateSafeCount = reports.filter(report => tolerateCheckArray(report)).length
  console.log("result: ", tolerateSafeCount);
}

main()