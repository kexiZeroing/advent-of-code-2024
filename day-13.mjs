import { readTextFile } from './utils.mjs';

function getMachineStats(machine) {
  const stats = machine.map(line => {
    return line.match(/\d+/g).map(Number);
  })
  return {
    A: [stats[0][0], stats[0][1]],
    B: [stats[1][0], stats[1][1]],
    prize: [stats[2][0], stats[2][1]]
  }
}

function findPrizeCost({ A, B, prize }) {
  const prizeX = prize[0];
  const prizeY = prize[1];

  const dp = new Map();
  dp.set("0,0", { cost: 0, timesA: 0, timesB: 0 });
  
  const queue = [[0, 0]];
  const MAX_TIMES = 100;

  while (queue.length) {
    const [x, y] = queue.shift();
    const current = dp.get(`${x},${y}`);

    for (const [move, cost] of [[A, 3], [B, 1]]) {
      if ((cost === 3 && current.timesA >= MAX_TIMES) || (cost === 1 && current.timesB >= MAX_TIMES)) {
        continue;
      }

      const [dx, dy] = move;
      const newX = x + dx;
      const newY = y + dy;
      const key = `${newX},${newY}`;

      const newCost = current.cost + cost;
      let newTimesA = current.timesA;
      let newTimesB = current.timesB;

      if (cost === 3) {
        newTimesA += 1;
      } else if (cost === 1) {
        newTimesB += 1;
      }

      if (!dp.has(key) || dp.get(key).cost > newCost) {
        dp.set(key, { cost: newCost, timesA: newTimesA, timesB: newTimesB });
        queue.push([newX, newY]);
      }
    }
  }

  const resultKey = `${prizeX},${prizeY}`;
  return dp.has(resultKey) ? dp.get(resultKey).cost : -1;
}

// I don't figure out how to do this one. LLM helped me with this...
// It involves using Cramer's Rule to solve a system of two linear equations.

// The two linear equations are:
// A[0] * timesA + B[0] * timesB = prize[0]
// A[1] * timesA + B[1] * timesB = prize[1]

// The formula for timesA is: 
// timesA = (prize[0] * B[1] - prize[1] * B[0]) / (A[0] * B[1] - A[1] * B[0]) 

// Substituting timesA back into one of the original equations, solving for timesB:
// timesB = (prize[0] - A[0] * timesA) / B[0]

function costTokensUseMath(machineStats) {
  const costs = machineStats.map(({ A, B, prize }) => {
    prize = prize.map(c => c + 10000000000000);

    let timesA = (prize[0] * B[1] - prize[1] * B[0]) / (A[0] * B[1] - A[1] * B[0]);

    if (Number.isInteger(timesA)) {
      let timesB = (prize[0] - A[0] * timesA) / B[0];
      return timesA * 3 + timesB;
    }

    return 0;
  })
 
  return costs.reduce((total, cost) => total += cost, 0);
}

async function main() {
  const filePath = './day-13-input.txt';
  const fileContent = await readTextFile(filePath);

  const machines = fileContent.trim().split('\n\n').map(line => {
    return line.trim().split('\n');
  });
  const machineStats = machines.map(getMachineStats);

  // part 1: fewest tokens needed to win the prize
  const tokens = machineStats
    .map(findPrizeCost)
    .filter(cost => cost > -1)
    .reduce((total, cost) => total += cost, 0);

  console.log('tokens needed to win the prize: ', tokens);

  // part 2: prize with big offset coordinates
  console.log('cost tokens using math: ', costTokensUseMath(machineStats));
}

main();