import { readTextFile } from './utils.mjs';

function getNextPosition(p, v, rows, cols) {
  p[0] += v[0];
  p[1] += v[1];
  if (p[0] < 0) {
    p[0] = cols + p[0];
  } else if (p[0] > cols - 1) {
    p[0] = p[0] - cols;
  }
  
  if (p[1] < 0) {
    p[1] = rows + p[1];
  } else if (p[1] > rows - 1) {
    p[1] = p[1] - rows;
  }

  return p;
}

function getQuadrantCount(positions, rows, cols) {
  const map = new Map();
  let midRow = (rows - 1) / 2;
  const midCol = (cols - 1) / 2;

  for (const [x, y] of positions) {
    if (x === midCol || y === midRow) {
      continue;
    }
    // left-top -> map[0]
    if (x < midCol && y < midRow) {
      map.set(0, (map.get(0) || 0) + 1);
    }
    // right-top -> map[1]
    else if (x > midCol && y < midRow) {
      map.set(1, (map.get(1) || 0) + 1);
    }
    // left-bottom -> map[2]
    else if (x < midCol && y > midRow) {
      map.set(2, (map.get(2) || 0) + 1);
    }
    // right-bottom -> map[3]
    else if (x > midCol && y > midRow) {
      map.set(3, (map.get(3) || 0) + 1);
    }
  }

  return map;
}

// I'm not sure what does "a picture of a Christmas tree" mean.
// Just iterate to find a tree shape pattern
function iterateToFindTree(robots, rows, cols) {
  let positions = robots.map(r => r.p);
  const vList = robots.map(r => r.v);
  let count = 0;

  while (true) {
    if (checkTreeShape(positions)) {
      break;
    }
    positions = positions.map((p, i) => getNextPosition(p, vList[i], rows, cols));
    count++;
  }

  return count;
}

function checkTreeShape(positions) {
  const postionSet = new Set();
  for (const [x, y] of positions) {
    const key = `${x},${y}`;
    postionSet.add(key);
  }

  for (let i = 0; i < positions.length; i++) {
    const [x, y] = positions[i];

    // look for this pattern:
    // ...X...
    // ..XXX..
    // .XXXXX.
    // XXXXXXX
    const check = 
      !postionSet.has(`${x - 3},${y}`) &&
      !postionSet.has(`${x - 2},${y}`) &&
      !postionSet.has(`${x - 1},${y}`) &&
      !postionSet.has(`${x + 1},${y}`) &&
      !postionSet.has(`${x + 2},${y}`) &&
      !postionSet.has(`${x + 3},${y}`) &&
      !postionSet.has(`${x - 3},${y + 1}`) &&
      !postionSet.has(`${x - 2},${y + 1}`) &&
      postionSet.has(`${x - 1},${y + 1}`) &&
      postionSet.has(`${x},${y + 1}`) &&
      postionSet.has(`${x + 1},${y + 1}`) &&
      !postionSet.has(`${x + 2},${y + 1}`) &&
      !postionSet.has(`${x + 3},${y + 1}`) &&
      !postionSet.has(`${x - 3},${y + 2}`) &&
      postionSet.has(`${x - 2},${y + 2}`) &&
      postionSet.has(`${x - 1},${y + 2}`) &&
      postionSet.has(`${x},${y + 2}`) &&
      postionSet.has(`${x + 1},${y + 2}`) &&
      postionSet.has(`${x + 2},${y + 2}`) &&
      !postionSet.has(`${x + 3},${y + 2}`) &&
      postionSet.has(`${x - 3},${y + 3}`) &&
      postionSet.has(`${x - 2},${y + 3}`) &&
      postionSet.has(`${x - 1},${y + 3}`) &&
      postionSet.has(`${x},${y + 3}`) &&
      postionSet.has(`${x + 1},${y + 3}`) &&
      postionSet.has(`${x + 2},${y + 3}`) &&
      postionSet.has(`${x + 3},${y + 3}`);

    if (check) {
      return true;
    }
  }

  return false;
}

async function main() {
  const filePath = './day-14-input.txt';
  const fileContent = await readTextFile(filePath);

  const robots = fileContent.trim().split('\n').map(line => {
    const lines = line.trim().split(' ');
    const pos = lines[0].slice(2).split(',');
    const velocity = lines[1].slice(2).split(',');
    return {
      p: pos.map(p => parseInt(p)),
      v: velocity.map(v => parseInt(v))
    }
  });

  // part 1: total safety factor after 100 seconds
  const TIMES = 100;
  const ROWS = 103;
  const COLS = 101;

  const grids = robots.map(({ p, v }) => {
    // do not change original robots data (used in part 2)
    p = [...p];
    v = [...v];
    for (let i = 0; i < TIMES; i++) {
      const nextPos = getNextPosition(p, v, ROWS, COLS);
      p = nextPos;
    }
    return p;
  });
  const quadrantCountMap = getQuadrantCount(grids, ROWS, COLS);

  let totalFactor = 1;
  for (const count of quadrantCountMap.values()) {
    totalFactor *= count;
  }

  console.log('totalFactor result: ', totalFactor);

  // part 2: when has a picture of a Christmas tree
  const iterateCount = iterateToFindTree(robots, ROWS, COLS);
  console.log('iterateCount result: ', iterateCount);
}

main();