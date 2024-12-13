import { readTextFile } from './utils.mjs';

function getAreaRegionMap(grid) {
  let n = grid.length;
  let m = grid[0].length;
  let visited = Array.from(Array(n), () => Array(m).fill(false));
  let regionMap = new Map();

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (grid[i][j]) {
        // there could be same character in different regions
        regionMap.set(`${grid[i][j]}-${i}-${j}`, dfs(i, j, grid[i][j], visited));
      }
    }
  }

  function dfs(i, j, k, visited) {
    if (i < 0 || j < 0 || i >= n || j >= m || grid[i][j] !== k || visited[i][j]) {
      return 0;
    }
    visited[i][j] = true;

    let area = 1;

    area += dfs(i - 1, j, k, visited);
    area += dfs(i + 1, j, k, visited);
    area += dfs(i, j - 1, k, visited);
    area += dfs(i, j + 1, k, visited);

    return area;
  }

  return regionMap;
}

function getPerimeterRegionMap(grid) {
  let n = grid.length;
  let m = grid[0].length;
  let visited = Array.from(Array(n), () => Array(m).fill(false));
  let regionMap = new Map();

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (grid[i][j]) {
        regionMap.set(`${grid[i][j]}-${i}-${j}`, dfs(i, j, grid[i][j], visited));
      }
    }
  }

  function dfs(i, j, k, visited) {
    if (i < 0 || j < 0 || i >= n || j >= m || grid[i][j] !== k || visited[i][j]) {
      return 0;
    }
    visited[i][j] = true;

    let perimeter = 0;

    if (i === 0 || grid[i - 1][j] !== k) {
      perimeter += 1;
    }
    if (i === n - 1 || grid[i + 1][j] !== k) {
      perimeter += 1;
    }
    if (j === 0 || grid[i][j - 1] !== k) {
      perimeter += 1;
    }
    if (j === m - 1 || grid[i][j + 1] !== k) {
      perimeter += 1;
    }

    let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (let [di, dj] of directions) {
      perimeter += dfs(i + di, j + dj, k, visited);
    }

    return perimeter;
  }

  return regionMap;
}

function getSidesRegionMap(grid) {
  let n = grid.length;
  let m = grid[0].length;
  let visited = Array.from(Array(n), () => Array(m).fill(false));
  let regionMap = new Map();

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (grid[i][j]) {
        regionMap.set(`${grid[i][j]}-${i}-${j}`, dfs(i, j, grid[i][j], visited));
      }
    }
  }

  function dfs(i, j, k, visited) {
    if (i < 0 || j < 0 || i >= n || j >= m || grid[i][j] !== k || visited[i][j]) {
      return 0;
    }
    visited[i][j] = true;

    // There is a key point: # of sides is equal to # of corners
    let corners = 0;

    // left-top corner
    if ((i === 0 || grid[i - 1][j] !== k) && (j === 0 || grid[i][j - 1] !== k)) {
      corners += 1;
    }
    // right-top corner
    if ((i === 0 || grid[i - 1][j] !== k) && (j === m - 1 || grid[i][j + 1] !== k)) {
      corners += 1;
    }
    // left-bottom corner
    if ((i === n - 1 || grid[i + 1][j] !== k) && (j === 0 || grid[i][j - 1] !== k)) {
      corners += 1;
    }
    // right-bottom corner
    if ((i === n - 1 || grid[i + 1][j] !== k) && (j === m - 1 || grid[i][j + 1] !== k)) {
      corners += 1;
    }
    // There are other 4 types of corners
    // AA
    // CA
    if (i + 1 < n && j - 1 >= 0 && grid[i + 1][j] === k && grid[i][j - 1] === k && grid[i + 1][j - 1] !== k) {
      corners += 1;
    }
    // AA
    // AC
    if (i + 1 < n && j + 1 < m && grid[i + 1][j] === k && grid[i][j + 1] === k && grid[i + 1][j + 1] !== k) {
      corners += 1;
    }
    // CA
    // AA
    if (i - 1 >= 0 && j - 1 >= 0 && grid[i - 1][j] === k && grid[i][j - 1] === k && grid[i - 1][j - 1] !== k) {
      corners += 1;
    }
    // AC
    // AA
    if (i - 1 >= 0 && j + 1 < m && grid[i - 1][j] === k && grid[i][j + 1] === k && grid[i - 1][j + 1] !== k) {
      corners += 1;
    }

    let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (let [di, dj] of directions) {
      corners += dfs(i + di, j + dj, k, visited);
    }

    return corners;
  }

  return regionMap;
}

async function main() {
  const filePath = './day-12-input.txt';
  const fileContent = await readTextFile(filePath);

  const matrix = fileContent.trim().split('\n').map(line => {
    return line.trim().split('');
  });

  const areaMap = getAreaRegionMap(matrix);
  const perimeterMap = getPerimeterRegionMap(matrix);
  const sidesMap = getSidesRegionMap(matrix);

  // part 1: total price of fencing (area * perimeter)
  let totalPriceUsePerimeter = 0;
  for (let [key, area] of areaMap.entries()) {
    const perimeter = perimeterMap.get(key);
    totalPriceUsePerimeter += area * perimeter;
  }

  console.log('totalPrice use primeter result: ', totalPriceUsePerimeter);

  // part 2: total price of fencing (area * sides)
  let totalPriceUseSides = 0;
  for (let [key, area] of areaMap.entries()) {
    const sides = sidesMap.get(key);
    totalPriceUseSides += area * sides;
  }
  console.log('totalPrice use sides result: ', totalPriceUseSides);
}

main();