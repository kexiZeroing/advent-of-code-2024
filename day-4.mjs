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

function getXmasCount(board) {
  const m = board.length;
  const n = board[0].length;
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
    [0, -1],
    [-1, 0],
    [-1, 1],
    [-1, -1]
  ];
  let count = 0;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      for (const [dx, dy] of directions) {
        let x = i;
        let y = j;
        let match = true;
        for (let k = 0; k < 'XMAS'.length; k++) {
          if (x < 0 || x >= m || y < 0 || y >= n || board[x][y] !== 'XMAS'.charAt(k)) {
            match = false;
            break;
          }
          x += dx;
          y += dy;
        }
        if (match) {
          count++;
        }
      }
    }
  }
  return count;
}

function isMAS(cells) {
  const str = cells.join('');
  return str === 'MAS' || str === 'SAM';
}

function getXShapeMasCount(board) {
  const m = board.length;
  const n = board[0].length;
  let count = 0;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === 'A') {
        // Check up-left to down-right
        if (i - 1 >= 0 && j - 1 >= 0 && i + 1 < m && j + 1 < n) {
          const diag1 = [board[i - 1][j - 1], board[i][j], board[i + 1][j + 1]];
          if (!isMAS(diag1)) {
            continue;
          }
          // Check up-right to down-left
          if (i - 1 >= 0 && j + 1 < n && i + 1 < m && j - 1 >= 0) {
            const diag2 = [board[i - 1][j + 1], board[i][j], board[i + 1][j - 1]];
            if (isMAS(diag2)) {
              count++;
            }
          }
        }
      }
    }
  }
  return count;
}

async function main() {
  const filePath = './day-4-input.txt';
  const fileContent = await readTextFile(filePath);

  const matrix = fileContent.trim().split('\n').map(line => {
    return line.trim().split('');
  });

  // part 1: count of XMAS in matrix
  const xmasCount = getXmasCount(matrix);
  console.log('xmasCount result: ', xmasCount);

  // part 2: count of MAS in X shape
  const xShapeMasCount = getXShapeMasCount(matrix);
  console.log('xShapeMasCount result: ', xShapeMasCount);
}

main()