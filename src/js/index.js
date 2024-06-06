"use strict";
const nodesCount = 6; // 节点数量
const nodes = [];
const edges = [];
document.addEventListener("DOMContentLoaded", () => {
    const graphContainer = document.getElementById('graphContainer');
    if (!graphContainer)
        return;
    nodes.splice(0, nodes.length);
    for (let i = 0; i < nodesCount; i++) {
        let x, y;
        do {
            x = getRandomInt(0, 970);
            y = getRandomInt(0, 600);
        } while (!checkDistance(nodes, x, y));
        nodes.push({ id: i, x, y });
    }
    // 生成树
    const dsu = new DSU(nodesCount);
    let cnt = 1;
    const edges = [];
    while (cnt < nodesCount) {
        const u = getRandomInt(0, nodesCount - 1);
        const v = getRandomInt(0, nodesCount - 1);
        if (dsu.same(u, v))
            continue;
        edges.push({ u, v });
        dsu.union(u, v);
        cnt++;
    }
    // 添加额外的边
    cnt = getRandomInt(0, nodesCount * (nodesCount - 1) / 2 - nodesCount);
    while (cnt--) {
        const u = getRandomInt(0, nodesCount - 1);
        const v = getRandomInt(0, nodesCount - 1);
        if (u !== v && !edges.some(e => (e.u === u && e.v === v) || (e.u === v && e.v === u))) {
            edges.push({ u, v });
        }
    }
    // 画节点
    nodes.forEach(node => {
        const nodeElement = createNode(node.id, node.x, node.y);
        graphContainer.appendChild(nodeElement);
    });
    // 画边
    edges.forEach(edge => {
        const edgeElement = createEdge(nodes[edge.u], nodes[edge.v]);
        graphContainer.appendChild(edgeElement);
    });
    // 添加用于显示累加权值的元素
    const totalWeightContainer = document.createElement('div');
    totalWeightContainer.id = 'totalWeight';
    totalWeightContainer.innerText = `Total weight selected: ${totalWeight}`;
    graphContainer.appendChild(totalWeightContainer);
    // 事件委托
    graphContainer.addEventListener('click', selectClickHandler);
    // 添加提交答案按钮元素
    const submitButton = createButton('提交答案', 'submitButton', submitAnswer);
    graphContainer.appendChild(submitButton);
    // 添加重新开始按钮元素
    const refreshButton = createButton('重新开始', 'refreshButton', refreshPage);
    graphContainer.appendChild(refreshButton);
});
