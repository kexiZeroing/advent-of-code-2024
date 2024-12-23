import { readTextFile } from './utils.mjs';

function findTrianglesStartWithT(adjacentMap) {
  const triangles = new Set();

  for (let nodeA of adjacentMap.keys()) {
    const neighborsA = [...adjacentMap.get(nodeA)];

    for (let i = 0; i < neighborsA.length; i++) {
      const nodeB = neighborsA[i];
      const neighborsB = adjacentMap.get(nodeB);

      const commonNeighbors = neighborsA.filter(neighbor => neighborsB.has(neighbor));

      // For each common neighbor, we have a triangle
      commonNeighbors.forEach(nodeC => {
        if ([nodeA, nodeB, nodeC].some(node => node.charAt(0) === 't')) {
          const triangle = [nodeA, nodeB, nodeC].sort().join(',');
          triangles.add(triangle);
        }
      });
    }
  }

  return triangles;
}

function findLargestConnection(adjacentMap) {
  const nodes = [...adjacentMap.keys()];
  let largestConnection = [];

  function explore(candidate, remainingNodes) {
    if (candidate.length > largestConnection.length) {
      largestConnection = [...candidate];
    }

    for (let i = 0; i < remainingNodes.length; i++) {
      const node = remainingNodes[i];

      // Check if this node is connected to all nodes in the candidate
      // Note: In JS, `every` for an empty array, it returns true.
      if (candidate.every(c => adjacentMap.get(c).has(node))) {
        explore([...candidate, node], remainingNodes.slice(i + 1));
      }
    }
  }

  explore([], nodes);
  return largestConnection.sort();
}

async function main() {
  const filePath = './day-23-input.txt';
  const fileContent = await readTextFile(filePath);

  const pairs = fileContent.trim().split('\n').map(line => {
    return line.split('-');
  });

  // part 1: three inter-connected computers
  const adjacentMap = new Map();
  for (const [p1, p2] of pairs) {
    adjacentMap.set(p1, (adjacentMap.get(p1) ?? new Set()).add(p2));
    adjacentMap.set(p2, (adjacentMap.get(p2) ?? new Set()).add(p1));
  }

  const targetConnections = findTrianglesStartWithT(adjacentMap);
  console.log('count of connections containing start-t: ', targetConnections.size);
  
  // part 2: largest inter connection and join together alphabetically
  const connNodes = findLargestConnection(adjacentMap);
  console.log('largest connection join together: ', connNodes.join(','));
}

main();