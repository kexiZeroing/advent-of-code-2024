class WeightedGraph {
  constructor() {
    this.adjacencyList = {};
  }
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }
  addEdge(vertex1, vertex2, weight) {
    this.adjacencyList[vertex1].push({ node: vertex2, weight });
    this.adjacencyList[vertex2].push({ node: vertex1, weight });
  }
}

const graph = new WeightedGraph();
graph.addVertex("A");
graph.addVertex("B");
graph.addVertex("C");
graph.addVertex("D");
graph.addVertex("E");
graph.addVertex("F");

graph.addEdge("A", "B", 4);
graph.addEdge("A", "C", 2);
graph.addEdge("B", "E", 3);
graph.addEdge("C", "D", 2);
graph.addEdge("C", "F", 4);
graph.addEdge("D", "E", 3);
graph.addEdge("D", "F", 1);
graph.addEdge("E", "F", 1);

function dijkstra(graph, start) {
  const distances = {};
  const previous = {};
  const nodes = new PriorityQueue();

  for (let vertex in graph.adjacencyList) {
    distances[vertex] = Infinity;
    previous[vertex] = null;
  }
  
  distances[start] = 0;
  nodes.enqueue(start, 0);

  while (nodes.values.length) {
    let { val: smallest } = nodes.dequeue();

    for (let neighbor of graph.adjacencyList[smallest]) {
      const nextNeighbor = neighbor.node;
      const candidate = distances[smallest] + neighbor.weight;

      if (candidate < distances[nextNeighbor]) {
        distances[nextNeighbor] = candidate;
        previous[nextNeighbor] = smallest;
        nodes.enqueue(nextNeighbor, candidate);
      }
    }
  }
  return { distances, previous };
}

class PriorityQueue {
  constructor() {
    this.values = [];
  }
  enqueue(val, priority) {
    this.values.push({ val, priority });
    this.bubbleUp();

    // simple version of enqueue:
    // this.values.push({ val, priority });
    // this.values.sort((a, b) => a.priority - b.priority);
  }
  bubbleUp() {
    let idx = this.values.length - 1;
    const element = this.values[idx];
    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      let parent = this.values[parentIdx];
      if (element.priority >= parent.priority) break;
      this.values[parentIdx] = element;
      this.values[idx] = parent;
      idx = parentIdx;
    }
  }
  dequeue() {
    const min = this.values[0];
    const end = this.values.pop();
    if (this.values.length > 0) {
      this.values[0] = end;
      this.sinkDown();
    }
    return min;

    // simple version of dequeue:
    // return this.values.shift();
  }
  sinkDown() {
    let idx = 0;
    const length = this.values.length;
    const element = this.values[0];
    while (true) {
      let leftChildIdx = 2 * idx + 1;
      let rightChildIdx = 2 * idx + 2;
      let leftChild, rightChild;
      let swap = null;

      if (leftChildIdx < length) {
        leftChild = this.values[leftChildIdx];
        if (leftChild.priority < element.priority) {
          swap = leftChildIdx;
        }
      }
      if (rightChildIdx < length) {
        rightChild = this.values[rightChildIdx];
        if (
          (swap === null && rightChild.priority < element.priority) ||
          (swap !== null && rightChild.priority < leftChild.priority)
        ) {
          swap = rightChildIdx;
        }
      }
      if (swap === null) break;
      this.values[idx] = this.values[swap];
      this.values[swap] = element;
      idx = swap;
    }
  }
}

function getPath(previous, end) {
  let path = [];
  let current = end;
  while (current) {
    path.push(current);
    current = previous[current];
  }
  return path.reverse();
}

// test
const { distances, previous } = dijkstra(graph, "A");
console.log("distances: ", distances);
console.log("path: ", getPath(previous, "F"));
