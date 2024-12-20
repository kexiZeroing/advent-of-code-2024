import { readTextFile } from './utils.mjs';

const getTilePos = (matrix, tile) => {
  const rows = matrix.length;
  const cols = matrix[0].length;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (matrix[i][j] === tile) {
        return [j, i];
      }
    }
  }
};

function bfs(matrix, start, end) {
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
  ];

  const isValid = (x, y) => {
    return (
      x >= 0 && x < matrix[0].length &&
      y >= 0 && y < matrix.length &&
      matrix[y][x] !== "#"
    );
  };

  const visited = new Set();
  const queue = [{ x: start[0], y: start[1], path: [] }];

  while (queue.length > 0) {
    const { x, y, path } = queue.shift();

    if (x === end[0] && y === end[1]) {
      return [...path, { x, y }];
    }

    visited.add(`${x},${y}`);

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (isValid(nx, ny) && !visited.has(`${nx},${ny}`)) {
        queue.push({ x: nx, y: ny, path: [...path, { x, y }] });
      }
    }
  }

  return [];
}

async function main() {
  const filePath = './day-20-input.txt';
  const fileContent = await readTextFile(filePath);

  const maze = fileContent.trim().split('\n').map(line => {
    return line.trim().split('');
  });

  const start = getTilePos(maze, 'S');
  const end = getTilePos(maze, 'E');
  const normalPath = bfs(maze, start, end);

  // part 1: cheats would save you at least 100 picoseconds
  let cheatsSave100s = 0;

  for (let firstPos = 0; firstPos < normalPath.length - 1; firstPos++) {
    for (let secondPos = firstPos + 1; secondPos < normalPath.length; secondPos++) {
      const savedBySkipping = secondPos - firstPos;

      let xDiff = Math.abs(normalPath[firstPos].x - normalPath[secondPos].x);
      let yDiff = Math.abs(normalPath[firstPos].y - normalPath[secondPos].y); 

      if (xDiff === 0 || yDiff === 0) {
        if (xDiff + yDiff > 2) {
          continue;
        }
        const saved = savedBySkipping - (xDiff + yDiff);
        if (saved >= 100) {
          cheatsSave100s++;
        }
      }
    }
  }

  console.log('cheats save at least 100 picoseconds: ', cheatsSave100s);
}

main();
