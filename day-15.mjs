import { readTextFile } from './utils.mjs';

const directions = {
  '<': { dx: 0, dy: -1 },
  '>': { dx: 0, dy: 1 },
  'v': { dx: 1, dy: 0 },
  '^': { dx: -1, dy: 0 }
};

function findRobot(state) {
  const rows = state.length;
  const cols = state[0].length;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (state[i][j] === '@') {
        return [i, j];
      }
    }
  }
}

function moveBox(state, moves, robot) {
  for (const move of moves) {
    const { dx, dy } = directions[move];
    let [x, y] = robot;

    while (state[x + dx][y + dy] === 'O') {
      x += dx;
      y += dy;
    }

    if (state[x + dx][y + dy] === '#') {
      continue;
    }

    state[x + dx][y + dy] = 'O';
    state[robot[0]][robot[1]] = '.';
    state[robot[0] + dx][robot[1] + dy] = '@';
    robot = [robot[0] + dx, robot[1] + dy];
  }

  return state;
}

function twiceWideMap(state) {
  return state.map(chars => {
    return chars.flatMap(c => {
      if (c === '#') {
        return ['#', '#'];
      } else if (c === 'O') {
        return ['[', ']'];
      } else if (c === '.') {
        return ['.', '.'];
      } else if (c === '@') {
        return ['@', '.'];
      }
    })
  });
}

// This may not be the correct way to do it, 
// it's difficult to describe the rule for move up and down,
// which is more complex than move left and right.
function moveWideBox(state, moves, robot) {
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    let [x, y] = robot;
    const startX = x;
    const startY = y;

    if (move === '<') {
      // .[][]@ -> [][]@.
      while (state[x][y - 1] === '[' || state[x][y - 1] === ']') {
        y--;
      }
      if (state[x][y - 1] === '#') {
        continue;
      } else {
        let j = y - 1;
        while (j < startY) {
          state[x][j] = '[';
          state[x][j + 1] = ']';
          j = j + 2;
        }
        state[x][startY] = '.';
        state[x][startY - 1] = '@';
        robot = [x, startY - 1];
      }
    } else if (move === '>') {
      // @[][]. -> .@[][]
      while (state[x][y + 1] === '[' || state[x][y + 1] === ']') {
        y++;
      }
      if (state[x][y + 1] === '#') {
        continue;
      } else {
        let j = y + 1;
        while (j > startY) {
          state[x][j] = ']';
          state[x][j - 1] = '[';
          j = j - 2;
        }
        state[x][startY] = '.';
        state[x][startY + 1] = '@';
        robot = [x, startY + 1];
      }
    } else if (move === '^') {
      // yes
      // ....##
      // .[][].
      // .@[]..
      //
      // no
      // ....##
      // .[][].
      // ..[]..
      // ...@..
    }
  }

  return state;
}

async function main() {
  const filePath = './day-15-input.txt';
  const fileContent = await readTextFile(filePath);

  const content = fileContent.trim().split('\n\n');
  const boxMap = content[0].split('\n').map((line, i) => {
    return line.trim().split('');
  })
  const moves = content[1].split('').filter(c => ['^', '<', '>', 'v'].includes(c));

  // part 1: sum of all boxes coordinates
  const boxMapClone = structuredClone(boxMap);
  const robot = findRobot(boxMapClone);
  const finalBoxMap = moveBox(boxMapClone, moves, robot);
  const rows = finalBoxMap.length;
  const cols = finalBoxMap[0].length;
  let sum = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (finalBoxMap[i][j] === 'O') {
        sum += 100 * i + j;
      }
    }
  }
  console.log('sum of all boxes coordinates: ', sum);

  // part 2: sums of twice as wide boxes
  const twiceBoxMap = twiceWideMap(boxMap);
  const robot2 = findRobot(twiceBoxMap);
  // const finalWideBoxMap = moveWideBox(twiceBoxMap, moves, robot2);
}

main();