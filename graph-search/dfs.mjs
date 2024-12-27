function dfs(i, j, k, visited) {
  if (i < 0 || j < 0 || i >= n || j >= m || matrix[i][j] !== k || visited[i][j]) {
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

function dfs(i, j, currentHeight, visited) {
  if (i < 0 || i >= m || j < 0 || j >= n || visited[i][j] || matrix[i][j] !== currentHeight) {
    return 0;
  }

  visited[i][j] = true;

  if (matrix[i][j] === 9) {
    return 1;
  }

  let count = 0;        
  count += dfs(i - 1, j, currentHeight + 1, visited);
  count += dfs(i + 1, j, currentHeight + 1, visited);
  count += dfs(i, j - 1, currentHeight + 1, visited);
  count += dfs(i, j + 1, currentHeight + 1, visited);

  visited[i][j] = false;
  return count;
}

function dfs(i, j, visited, currentPath, allPaths) {
  if (i < 0 || j < 0 || i >= m || j >= n || visited[i][j] || matrix[i][j] === '#') {
    return;
  }
  
  visited[i][j] = true;
  currentPath.push([i, j]);

  if (matrix[i][j] === 'E') {
    allPaths.push([...currentPath]);
  } else {
    dfs(i - 1, j, visited, currentPath, allPaths);
    dfs(i + 1, j, visited, currentPath, allPaths);
    dfs(i, j - 1, visited, currentPath, allPaths);
    dfs(i, j + 1, visited, currentPath, allPaths);
  }

  visited[i][j] = false;
  currentPath.pop();
}
