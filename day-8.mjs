import { readTextFile } from './utils.mjs';

function countOfAntinode(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const antennaGroups = {};
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const freq = grid[i][j];
      // Check if freq is an antenna (a-z, A-Z, 0-9)
      if (/[a-zA-Z0-9]/.test(freq)) {
        if (!antennaGroups[freq]) {
          antennaGroups[freq] = [];
        }
        antennaGroups[freq].push([i, j]);
      }
    }
  }

  const antinodeSet = new Set();
  
  for (const freq in antennaGroups) {
    const positions = antennaGroups[freq];
    const n = positions.length;
    if (n < 2) continue;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const A = positions[i];
        const B = positions[j];

        // Calculate antinode positions based on A and B
        // Find P as below: 
        // 1. Calculate the vector from A to B:
        //    VectorAB = B - A = [Bx - Ax, By - Ay]
        // 2. Double this vector to find the position of P:
        //    VectorAP = 2 * [Bx - Ax, By - Ay] = [2 * (Bx - Ax), 2 * (By - Ay)]
        // 3. Add this vector to A to get the position of P.
        //    P = A + VectorAP = [Ax, Ay] + [2 * (Bx - Ax), 2 * (By - Ay)] = [2 * Bx - Ax, 2 * By - Ay]
        //
        // Find Q as below:
        // 1. VectorBA = A - B = [Ax - Bx, Ay - By]
        // 2. VectorBQ = [2 * (Ax - Bx), 2 * (Ay - By)]
        // 3. Q = [Bx, By] + [2 * (Ax - Bx), 2 * (Ay - By)] = [2 * Ax - Bx, 2 * Ay - By]
        const P = [2 * B[0] - A[0], 2 * B[1] - A[1]];
        const Q = [2 * A[0] - B[0], 2 * A[1] - B[1]];

        // Check if P and Q are within the grid
        if (P[0] >= 0 && P[0] < rows && P[1] >= 0 && P[1] < cols) {
          antinodeSet.add(P[0] + ',' + P[1]);
        }
        if (Q[0] >= 0 && Q[0] < rows && Q[1] >= 0 && Q[1] < cols) {
          antinodeSet.add(Q[0] + ',' + Q[1]);
        }
      }
    }
  }  
  return antinodeSet.size;
}

async function main() {
  const filePath = './day-8-input.txt';
  const fileContent = await readTextFile(filePath);

  const matrix = fileContent.trim().split('\n').map(line => {
    return line.trim().split('');
  });

  // part 1: locations of antinode within the map
  const antinodeLocations = countOfAntinode(matrix);
  console.log('antinodeLocations result: ', antinodeLocations);
}

main();