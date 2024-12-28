// Start Node: The starting point.
// End Node: The target point.
// Open List: Nodes to be evaluated.
// Closed List: Nodes already evaluated.
// Heuristic (h): Estimated cost to reach the goal.
// Cost (g): Cost from start to current node.
// Total Cost (f): f = g + h

// Dijkstra is a special case for A* (when the heuristics is zero).

function aStar(grid, start, end) {
  const openList = [];
  const closedList = new Set();

  openList.push({
    position: start,
    g: 0,
    h: heuristic(start, end),
    f: heuristic(start, end),
    parent: null,
  });

  while (openList.length > 0) {
    openList.sort((a, b) => a.f - b.f);
    const currentNode = openList.shift();

    if (currentNode.position[0] === end[0] && currentNode.position[1] === end[1]) {
      return reconstructPath(currentNode);
    }

    closedList.add(`${currentNode.position[0]},${currentNode.position[1]}`);

    for (const neighbor of getNeighbors(grid, currentNode.position)) {
      if (closedList.has(`${neighbor[0]},${neighbor[1]}`)) {
        continue;
      }

      const gScore = currentNode.g + 1; // Assume cost between neighbors is 1

      const existingNode = openList.find(
        (node) => node.position[0] === neighbor[0] && node.position[1] === neighbor[1]
      );

      // It's being discovered for the first time
      if (!existingNode) {
        openList.push({
          position: neighbor,
          g: gScore,
          h: heuristic(neighbor, end),
          f: gScore + heuristic(neighbor, end),
          parent: currentNode,
        });
      }
      // We find a shorter path to this node
      else if (gScore < existingNode.g) {
        existingNode.g = gScore;
        existingNode.f = gScore + existingNode.h;
        existingNode.parent = currentNode;
      }
    }
  }

  return [];
}

// Heuristic: Manhattan Distance
function heuristic(pos0, pos1) {
  return Math.abs(pos0[0] - pos1[0]) + Math.abs(pos0[1] - pos1[1]);
}

// Get neighbors
function getNeighbors(grid, [x, y]) {
  const neighbors = [];
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  for (const [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;
    if (grid[nx] && grid[nx][ny] === 0) {
      neighbors.push([nx, ny]);
    }
  }

  return neighbors;
}

// Reconstruct the path from end to start
function reconstructPath(node) {
  const path = [];
  while (node) {
    path.push(node.position);
    node = node.parent;
  }
  return path.reverse();
}

// test
// 0: Walkable Cell, 1: Non-walkable Cell (Obstacle)
const grid = [
  [0, 1, 0, 0],
  [0, 1, 0, 1],
  [0, 0, 0, 1],
  [1, 1, 0, 0],
];
const start = [0, 0];
const end = [3, 3];

const path = aStar(grid, start, end);
console.log("Path:", path);
