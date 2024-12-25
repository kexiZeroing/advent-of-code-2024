import { readTextFile } from './utils.mjs';

// #####
// .####
// .####
// .####  -> 0,5,3,4,3
// .#.#.
// .#...
// .....
function getBlockHeights(block, type) {
  const rows = block.length;
  const cols = block[0].length;
  const result = Array(cols).fill(0);

  if (type === 'lock') {
    for (let i = rows - 2; i > 0; i--) {
      const line = block[i].split('');
      for (let j = 0; j < cols; j++) {
        if (line[j] === '#' && result[j] === 0) {
          result[j] = i;
        }
      }
    }
  } else if (type === 'key') {
    for (let i = 1; i < rows - 1; i++) {
      const line = block[i].split('');
      for (let j = 0; j < cols; j++) {
        if (line[j] === '#' && result[j] === 0) {
          result[j] = rows - 1 - i;
        }
      }
    }
  }

  return result.join(',');
}

async function main() {
  const filePath = './day-25-input.txt';
  const fileContent = await readTextFile(filePath);

  const locksSet = new Set();
  const keysSet = new Set();

  const schematics = fileContent.trim().split('\n\n').map(block => {
    return block.trim().split('\n');
  })
  const rows = schematics[0].length;
  const cols = schematics[0][0].length;

  schematics.forEach(block => {
    if (block[0] === '#####' && block[rows - 1] === '.....') {
      locksSet.add(getBlockHeights(block, 'lock'));
    } else if (block[0] === '.....' && block[rows - 1] === '#####') {
      keysSet.add(getBlockHeights(block, 'key'));
    }
  })

  let fitCount = 0;

  for (const lock of locksSet) {
    const l = lock.split(',').map(Number);
    for (const key of keysSet) {
      const k = key.split(',').map(Number);
      if (k.every((h, i) => l[i] + h <= rows - 2)) {
        fitCount++;
      }
    }
  }

  console.log("unique lock/key pairs fit: ", fitCount);
}

main();