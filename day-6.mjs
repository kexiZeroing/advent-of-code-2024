import { readTextFile } from './utils.mjs';

const DIRECTIONS = {
  '^': 0,  // up
  '>': 1,  // right
  'v': 2,  // down
  '<': 3  // left
};

function findGuard(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (Object.keys(DIRECTIONS).includes(matrix[i][j])) {
        return [i, j, DIRECTIONS[matrix[i][j]]];
      }
    }
  }
}

function goLeaveTheMatrix({ matrix, start, direction }) {
  const m = matrix.length;
  const n = matrix[0].length;

  // ** up is [-1, 0]: move the cell by decreasing the row index (x).
  const dirOptions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  let step = dirOptions[direction];
  let [x, y] = start;
  matrix[x][y] = 'X';

  while (true) {
    let frontX, frontY;
    switch (direction) {
      case 0:
        frontX = x - 1;
        frontY = y;
        break;
      case 1:
        frontX = x;
        frontY = y + 1;
        break;
      case 2:
        frontX = x + 1;
        frontY = y;
        break;
      case 3:
        frontX = x;
        frontY = y - 1;
        break;
    }

    if (
      frontX >= 0 &&
      frontX < m &&
      frontY >= 0 &&
      frontY < n &&
      matrix[frontX][frontY] === '#'
    ) {
      direction = (direction + 1) % dirOptions.length;
      step = dirOptions[direction];
      continue;
    }

    x += step[0];
    y += step[1];

    if (x < 0 || x >= m || y < 0 || y >= n) {
      break;
    }

    matrix[x][y] = 'X';
  }
}

function getXInMatrix(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  let count = 0;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === 'X') {
        count++;
      }
    }
  }

  return count;
}

function simulate(grid, start, directions) {
  const visited = new Set();
  let { x, y, dir } = start;

  while (true) {
    const state = `${x},${y},${dir}`;
    if (visited.has(state)) {
      return 'loop';
    }
    visited.add(state);
    const [dx, dy] = directions[dir];
    const frontX = x + dx;
    const frontY = y + dy;

    if (frontX < 0 || frontX >= grid.length || frontY < 0 || frontY >= grid[0].length) {
      return 'exit';
    }
    if (grid[frontX][frontY] === '#') {
      dir = (dir + 1) % 4;
    } else {
      x = frontX;
      y = frontY;
    }
  }
}

// I don't figure out how to do this one. LLM helped me with this...
// The answer is correct, but I don't think it's performant.
function countLoopPositions(grid) {
  const [x, y, dir] = findGuard(grid);
  const guard = { x, y, dir };

  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  let count = 0;
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] !== '#' && (i !== guard.x || j !== guard.y)) {
        grid[i][j] = '#';

        const result = simulate(grid, guard, directions);
        if (result === 'loop') {
          count++;
        }

        grid[i][j] = '.';
      }
    }
  }
  return count;
}

async function main() {
  const filePath = './day-6-input.txt';
  const fileContent = await readTextFile(filePath);

  const matrix = fileContent.trim().split('\n').map(line => {
    return line.trim().split('');
  });

  // part 1: count X of leave the matrix
  const [startX, startY, startDirection] = findGuard(matrix);
  const clonedMatrix = structuredClone(matrix);
  goLeaveTheMatrix({
    matrix: clonedMatrix,
    start: [startX, startY],
    direction: startDirection
  });

  const xCount = getXInMatrix(clonedMatrix);
  console.log("xCount result: ", xCount);

  // part 2: count X of leave the matrix
  const loopCount = countLoopPositions(matrix);
  console.log("loopCount result: ", loopCount);
}

main();