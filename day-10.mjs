import { readTextFile } from './utils.mjs';

function sumOfTrails(board, countTrails) {
  let m = board.length;
  let n = board[0].length;
  let result = 0;
  
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === 0) {
        // new visited array for each trailhead
        let visited = Array.from(Array(m), () => Array(n).fill(false));
        let count = dfs(i, j, 0, visited);
        result += count;
      }
    }
  }

  function dfs(i, j, currentHeight, visited) {
    if (i < 0 || i >= m || j < 0 || j >= n || visited[i][j] || board[i][j] !== currentHeight) {
      return 0;
    }
   
    // Note that a trailhead's score is the number of 9-height positions reachable 
    // from this trailhead. (same trailhead to same 9-height counts 1 score)
    if (!countTrails) {
      visited[i][j] = true;
    }

    if (board[i][j] === 9) {
      return 1;
    }

    // part 2 can reach the same 9-height position multiple times
    if (countTrails) {
      visited[i][j] = true;
    }
    
    let count = 0;        
    count += dfs(i - 1, j, currentHeight + 1, visited);
    count += dfs(i + 1, j, currentHeight + 1, visited);
    count += dfs(i, j - 1, currentHeight + 1, visited);
    count += dfs(i, j + 1, currentHeight + 1, visited);

    visited[i][j] = false;
    return count;
  }
  
  return result;
}

async function main() {
  const filePath = './day-10-input.txt';
  const fileContent = await readTextFile(filePath);

  const matrix = fileContent.trim().split('\n').map(line => {
    return line.trim().split('').map(Number);
  });

  console.log('sumOfTrailheads result:', sumOfTrails(matrix, false))
  console.log('sumOfDistinctTrails result:', sumOfTrails(matrix, true))
}

main();