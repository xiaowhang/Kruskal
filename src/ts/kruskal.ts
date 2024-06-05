let correctAnswer = 0; // 用于存储正确答案
const ans: { node1: number, node2: number, weight: number }[] = [];

function KruskalAlgorithm(nodes: { id: number, x: number, y: number }[], edges: { u: number, v: number, weight: number }[]): void {
  edges.sort((a, b) => a.weight - b.weight);

  const dsu = new DSU(nodesCount);

  for (const edge of edges) {
    if (!dsu.same(edge.u, edge.v)) {
      correctAnswer += edge.weight;
      ans.push({ node1: edge.u, node2: edge.v, weight: edge.weight });
      dsu.union(edge.u, edge.v);
    }
  }
}