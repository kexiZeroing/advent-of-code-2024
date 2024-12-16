import { readTextFile } from './utils.mjs';

const getTilePos = (matrix, tile) => {
  let m = matrix.length;
  let n = matrix[0].length;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === tile) {
        return [i, j];
      }
    }
  }
}

const getPathScore = (path, dir = [0, 1]) => {
  let score = 0;
  for (let i = 1; i < path.length; i++) {
    const x = path[i][0];
    const y = path[i][1];

    if (path[i - 1][0] + dir[0] === x && path[i - 1][1] + dir[1] === y) {
      score += 1;
    } else {
      score += 1001;
      dir = [x - path[i - 1][0], y - path[i - 1][1]];
    }
  }
  return score;
}

// Normal DFS is too slow to solve it when the matrix is large.
// Need to use something like dijkstra to find the shortest path.
// Keep this function for future reference to solve maze paths
function findAllPaths(matrix, start) {
  const m = matrix.length;
  const n = matrix[0].length;
  const visited = Array.from(Array(m), () => Array(n).fill(false));
  const allPaths = [];

  dfs(matrix, start[0], start[1], visited, [], allPaths);

  return allPaths;

  function dfs(matrix, x, y, visited, currentPath, allPaths) {
    if (x < 0 || y < 0 || x >= m || y >= n || visited[x][y] || matrix[x][y] === '#') {
      return;
    }
    visited[x][y] = true;

    currentPath.push([x, y]);

    if (matrix[x][y] === 'E') {
      allPaths.push([...currentPath]);
    } else {
      dfs(matrix, x - 1, y, visited, currentPath, allPaths);
      dfs(matrix, x + 1, y, visited, currentPath, allPaths);
      dfs(matrix, x, y - 1, visited, currentPath, allPaths);
      dfs(matrix, x, y + 1, visited, currentPath, allPaths);
    }

    visited[x][y] = false;
    currentPath.pop();
  }
}

function dijkstra(matrix, start) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  const queue = [];
  const costMap = new Map();

  queue.push([0, { row: start[0], col: start[1], dir: 1 }]);
  // start dir [0, 1]
  costMap.set(`${start[0]},${start[1]},1`, 0);

  while (queue.length) {
    const [currentCost, { row, col, dir }] = queue.shift();

    if ((costMap.get(`${row},${col},${dir}`) || Infinity) < currentCost) {
      continue;
    }

    const [dx, dy] = directions[dir];
    const newRow = row + dx;
    const newCol = col + dy;

    if (newRow >= 0 && newCol >= 0 && newRow < rows && newCol < cols && matrix[newRow][newCol] !== '#') {
      const newCost = currentCost + 1;
      const key = `${newRow},${newCol},${dir}`;
      if (newCost < (costMap.get(key) || Infinity)) {
        costMap.set(key, newCost);
        queue.push([newCost, { row: newRow, col: newCol, dir }]);
      }
    }

    // [(dir - 1 + 4) % 4] handles turning left
    // [(dir + 1) % 4] handles turning right 
    for (const newDirection of [(dir - 1 + 4) % 4, (dir + 1) % 4]) {
      const newCost = currentCost + 1000;
      const key = `${row},${col},${newDirection}`;
      if (newCost < (costMap.get(key) || Infinity)) {
        costMap.set(key, newCost);
        queue.push([newCost, { row, col, dir: newDirection }]);
      }
    }
  }

  return costMap;
}

async function main() {
  const filePath = './day-16-input.txt';
  const fileContent = await readTextFile(filePath);

  const maze = fileContent.trim().split('\n').map(line => {
    return line.trim().split('');
  })
  const start = getTilePos(maze, 'S');
  const end = getTilePos(maze, 'E');

  // part 1: lowest score could possibly get
  // const allPaths = findAllPaths(maze, start);
  // let minPathScore = Infinity;
  // for (const path of allPaths) {
  //   const pathScore = getPathScore(path);
  //   if (pathScore < minPathScore) {
  //     minPathScore = pathScore;
  //   }
  // }
  
  const visitedCostMap = dijkstra(maze, start);
  let minCost = Infinity;

  for (let dir = 0; dir < 4; dir++) {
    const key = `${end[0]},${end[1]},${dir}`;
    const cost = visitedCostMap.get(key) || Infinity;
    minCost = Math.min(minCost, cost);
  }
  
  console.log('lowest score for the end: ', minCost);
}

main();