import { readTextFile } from './utils.mjs';

function generateSpace(bytes, rows, cols) {
  const maze = Array.from(Array(rows), () => Array(cols).fill('.'));

  for (const byte of bytes) {
    // byte: X from left, Y from top 
    maze[byte[1]][byte[0]] = '#';
  }
  return maze;
}

// Another find path in maze, similar to day 16
function dijkstra(matrix, start = [0, 0]) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  const queue = []; // [cost, row, col]
  const costMap = new Map();
  // store previous node in the shortest path (used in part 2)
  const parentMap = new Map(); 

  queue.push([0, start[0], start[1]]);
  costMap.set(`${start[0]},${start[1]}`, 0);
  parentMap.set(`${start[0]},${start[1]}`, null); 

  while (queue.length) {
    queue.sort((a, b) => a[0] - b[0]);
    const [currentCost, row, col] = queue.shift();

    if (currentCost > (costMap.get(`${row},${col}`) || Infinity)) {
      continue;
    }

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;

      if (
        newRow >= 0 &&
        newCol >= 0 &&
        newRow < rows &&
        newCol < cols &&
        matrix[newRow][newCol] !== '#'
      ) {
        const newCost = currentCost + 1;
        const key = `${newRow},${newCol}`;

        if (newCost < (costMap.get(key) || Infinity)) {
          costMap.set(key, newCost);
          parentMap.set(key, `${row},${col}`);
          queue.push([newCost, newRow, newCol]);
        }
      }
    }
  }

  return { costMap, parentMap };
}

function constructPath(parentMap, start, end) {
  const path = [];
  let current = `${end[0]},${end[1]}`;

  while (current) {
    path.unshift(current);
    current = parentMap.get(current);

    if (current === `${start[0]},${start[1]}`) {
      break;
    }
  }

  return path;
}

function getCauseByte(bytes, space, shortestPath) {
  let minPath = shortestPath;
  const rows = space.length;
  const cols = space[0].length;

  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    space[byte[1]][byte[0]] = '#';

    // Recompute the shortest path only if it dropped into the current shortest path.
    if (!minPath.includes(`${byte[1]},${byte[0]}`)) {
      continue;
    }
    
    const { costMap, parentMap } = dijkstra(space);
    if (Number.isFinite(costMap.get(`${rows - 1},${cols - 1}`))) {
      minPath = constructPath(parentMap, [0, 0], [rows - 1, cols - 1]);
    } else {
      return byte;
    }
  }

  return null;
}

async function main() {
  const filePath = './day-18-input.txt';
  const fileContent = await readTextFile(filePath);

  const bytePositions = fileContent.trim().split('\n').map(line => {
    const pos = line.split(',').map(Number);
    return [pos[0], pos[1]];
  })
  
  const ROWS = 71;
  const COLUMNS = 71;
  const space = generateSpace(bytePositions.slice(0, 1024), ROWS, COLUMNS);

  // part 1: min number of steps to exit
  const minSteps = dijkstra(space)['costMap'].get(`${ROWS - 1},${COLUMNS - 1}`);
  console.log('min steps to exit: ', minSteps);

  // part 2: first byte that will prevent the exit
  const parentMap = dijkstra(space)['parentMap'];
  const shortestPath = constructPath(parentMap, [0, 0], [ROWS - 1, COLUMNS - 1]);
  const bytesToPreventExit = getCauseByte(bytePositions.slice(1024), space, shortestPath);

  console.log('first byte that will prevent the exit: ', bytesToPreventExit);
}

main();