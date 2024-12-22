import { readTextFile } from './utils.mjs';

async function main() {
  const filePath = './day-21-input.txt';
  const fileContent = await readTextFile(filePath);

  const codes = fileContent.trim().split('\n');

  // +---+---+---+
  // | 7 | 8 | 9 |
  // +---+---+---+
  // | 4 | 5 | 6 |
  // +---+---+---+
  // | 1 | 2 | 3 |
  // +---+---+---+
  //     | 0 | A |
  //     +---+---+
  // 
  //     +---+---+
  //     | ^ | A |
  // +---+---+---+
  // | < | v | > |
  // +---+---+---+
  
  const numKeypad = {
    'A': {x: 2, y: 3},
    '#': {x: 0, y: 3},
    '0': {x: 1, y: 3},
    '1': {x: 0, y: 2},
    '2': {x: 1, y: 2},
    '3': {x: 2, y: 2},
    '4': {x: 0, y: 1},
    '5': {x: 1, y: 1},
    '6': {x: 2, y: 1},
    '7': {x: 0, y: 0},
    '8': {x: 1, y: 0},
    '9': {x: 2, y: 0},
  };

  const dirKeypad = {
    'A': {x: 2, y: 0},
    '#': {x: 0, y: 0},
    '^': {x: 1, y: 0},
    '<': {x: 0, y: 1},
    'v': {x: 1, y: 1},
    '>': {x: 2, y: 1},
  };

  function keypadBFSPath(keypad, start, end) {
    const directions = [
      { x: 0, y: -1, c: '^' },
      { x: 0, y: 1, c: 'v' },
      { x: -1, y: 0, c: '<' },
      { x: 1, y: 0, c: '>' },
    ];
  
    const queue = [{ x: keypad[start].x, y: keypad[start].y, path: '' }];
    const distances = new Map();
    const minPath = [];
    
    if (start === end) {
      return ['A'];
    }
  
    while (queue.length > 0) {
      const { x, y, path } = queue.shift();
  
      if (x === keypad[end].x && y === keypad[end].y) {
        minPath.push(`${path}A`);
        continue;
      }
  
      if (distances.has(`${x}-${y}`) && distances.get(`${x}-${y}`) < path.length) {
        continue;
      }
  
      distances.set(`${x}-${y}`, path.length);
  
      for (const dir of directions) {
        const nx = x + dir.x;
        const ny = y + dir.y;
  
        if (nx === keypad['#'].x && ny === keypad['#'].y) {
          continue;
        }

        const isValid = Object.values(keypad).find(k => k.x === nx && k.y === ny);
        if (isValid) {
          queue.push({
            x: nx,
            y: ny,
            path: path + dir.c,
          });
        }
      }
    }

    return minPath;
  }

  // Below code is not correct since it doesn't garantee the shortest path for next iteration.
  // 
  // let seq = '';
  // for (let i = 0; i < code.length; i++) {
  //   if (i === 0) {
  //     seq += keypadBFSPath(numKeypad, 'A', code[i]);
  //   } else {
  //     seq += keypadBFSPath(numKeypad, code[i - 1], code[i]);
  //   }
  // }
  //
  // 1. Need to return all the minPaths from `keypadBFSPath` function.
  // 2. Recursively computes the final length for `robotNum - 1` robots and chooses the minimum value.

  // need a cache for part 2 iteration
  const cache = new Map();

  function getFinalSequence(numpad, code, robotNum) {
    const key = `${code}-${robotNum}`;
    if (cache.get(key)) {
      return cache.get(key);
    }
    
    let current = 'A'
    let length = 0;

    for (const char of code) {
      const seqs = keypadBFSPath(numpad, current, char);
      if (robotNum === 0) {
        length += seqs[0].length;
      } else {
        const possibleSeqsLen = seqs.map(seq => getFinalSequence(dirKeypad, seq, robotNum - 1));
        length += Math.min(...possibleSeqsLen);
      }

      current = char;
    }

    cache.set(key, length);
    return length;
  }

  // part 1: complexity of the code with 2 robots
  let robots = 2;
  let totalComplexity = 0;
  for (const code of codes) {
    const num = Number(code.slice(0, 3));
    const seqLen = getFinalSequence(numKeypad, code, robots);
    totalComplexity += num * seqLen;
  }
  console.log('code complexities with 2 robots: ', totalComplexity);

  // part 2: same logic but with 25 robots
  robots = 25;
  totalComplexity = 0;
  for (const code of codes) {
    const num = Number(code.slice(0, 3));
    const seqLen = getFinalSequence(numKeypad, code, robots);
    totalComplexity += num * seqLen;
  }
  console.log('code complexities with 25 robots: ', totalComplexity);
}

main();

