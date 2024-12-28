function bfs(matrix, start, end) {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  const isValid = (x, y) => {
    return (
      x >= 0 && x < matrix[0].length &&
      y >= 0 && y < matrix.length &&
      matrix[y][x] !== "#"
    );
  };

  const visited = new Set();
  const queue = [{ x: start[0], y: start[1], path: [] }];

  while (queue.length > 0) {
    const { x, y, path } = queue.shift();

    if (x === end[0] && y === end[1]) {
      return [...path, { x, y }];
    }

    visited.add(`${x},${y}`);

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (isValid(nx, ny) && !visited.has(`${nx},${ny}`)) {
        queue.push({ x: nx, y: ny, path: [...path, { x, y }] });
      }
    }
  }

  return [];
}

// test
const matrix = [
  [".", ".", ".", "#"],
  ["#", ".", "#", "."],
  [".", ".", ".", "."],
  ["#", "#", ".", "."],
];

const start = [0, 0];
const end = [3, 3];

console.log(bfs(matrix, start, end));
