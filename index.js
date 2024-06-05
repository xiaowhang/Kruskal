"use strict";
let totalWeight = 0; // 用于累加边的权值
let answer = 0; // 用于存储正确答案
const nodesCount = 6; // Number of nodes
const nodes = [];
const edges = [];
const ans = [];
const op = [];
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function createNode(id, x, y) {
    const node = document.createElement('div');
    node.className = 'node';
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    node.innerText = id.toString();
    return node;
}
function checkDistance(nodes, x, y) {
    for (const node of nodes) {
        const distance = Math.hypot(node.x - x, node.y - y);
        if (distance < 100) {
            return false;
        }
    }
    return true;
}
function createEdge(node1, node2) {
    const x1 = node1.x + 15, y1 = node1.y + 15;
    const x2 = node2.x + 15, y2 = node2.y + 15;
    const edge = document.createElement('div');
    edge.className = 'edge';
    const distance = Math.hypot(x2 - x1, y2 - y1);
    edge.style.width = `${distance}px`; // 使用两点之间的距离作为边的长度
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    edge.style.transform = `rotate(${angle}deg)`;
    edge.style.left = `${x1}px`;
    edge.style.top = `${y1}px`;
    const weightElement = document.createElement('div');
    weightElement.className = 'weight';
    weightElement.innerText = Math.round(distance / 100).toString(); // 使用两点之间的距离作为边的权值
    weightElement.style.transform = `rotate(${-angle}deg)`;
    edges.push({ from: node1.id, to: node2.id, weight: Math.round(distance / 100) });
    edge.appendChild(weightElement);
    edge.setAttribute('data-node1', node1.id.toString());
    edge.setAttribute('data-node2', node2.id.toString());
    return edge;
}
document.addEventListener("DOMContentLoaded", () => {
    const graphContainer = document.getElementById('graphContainer');
    if (!graphContainer)
        return;
    nodes.splice(0, nodes.length);
    for (let i = 0; i < nodesCount; i++) {
        let x, y;
        do {
            x = getRandomInt(0, 900);
            y = getRandomInt(0, 400);
        } while (!checkDistance(nodes, x, y));
        nodes.push({ id: i, x, y });
    }
    // 保证图是连通的
    let edges = [];
    for (let i = 1; i < nodesCount; i++) {
        const j = getRandomInt(0, i - 1);
        edges.push({ from: i, to: j });
    }
    // 添加额外的边
    const additionalEdgesCount = getRandomInt(1, nodesCount);
    for (let i = 0; i < additionalEdgesCount; i++) {
        const from = getRandomInt(0, nodesCount - 1);
        const to = getRandomInt(0, nodesCount - 1);
        if (from !== to && !edges.some(e => (e.from === from && e.to === to) || (e.from === to && e.to === from))) {
            edges.push({ from, to });
        }
    }
    // 画节点
    nodes.forEach(node => {
        const nodeElement = createNode(node.id, node.x, node.y);
        graphContainer.appendChild(nodeElement);
    });
    // 画边
    edges.forEach(edge => {
        const edgeElement = createEdge(nodes[edge.from], nodes[edge.to]);
        edgeElement.addEventListener('click', edgeClickHandler); // 添加点击事件监听器
        graphContainer.appendChild(edgeElement);
    });
    // 添加用于显示累加权值的元素
    const totalWeightContainer = document.createElement('div');
    totalWeightContainer.id = 'totalWeight';
    totalWeightContainer.style.position = 'absolute';
    totalWeightContainer.style.left = '20px'; // 距离左边缘 20px
    totalWeightContainer.style.bottom = '20px'; // 距离底部 20px
    totalWeightContainer.innerText = `Total weight selected: ${totalWeight}`;
    graphContainer.appendChild(totalWeightContainer);
    // 添加提交答案按钮元素
    const submitButton = document.createElement('button');
    submitButton.addEventListener('click', submitAnswer); // 添加点击事件处理程序
    submitButton.className = "Button submitButton";
    submitButton.style.position = 'absolute';
    submitButton.style.right = '20px'; // 距离右边缘 20px
    submitButton.style.bottom = '20px'; // 距离底部 20px
    submitButton.innerText = '提交答案';
    graphContainer.appendChild(submitButton);
    // 添加重新开始按钮元素
    const refreshButton = document.createElement('button');
    refreshButton.addEventListener('click', function refreshPage() { location.reload(); }); // 添加点击事件处理程序
    refreshButton.className = "Button refreshButton";
    refreshButton.style.position = 'absolute';
    refreshButton.style.left = '1000px'; // 距离左边缘 1000px
    refreshButton.style.top = '20px'; // 距离底部 20px
    refreshButton.innerText = '重新开始';
    graphContainer.appendChild(refreshButton);
});
// 点击时的处理
function edgeClickHandler(event) {
    const clicked = event.target;
    let edgeElement;
    let weightElement;
    if (clicked.classList.contains('weight')) {
        weightElement = clicked;
        edgeElement = clicked.parentElement;
    }
    else if (clicked.classList.contains('edge')) {
        edgeElement = clicked;
        weightElement = clicked.querySelector('.weight');
    }
    else
        return;
    const node1 = parseInt(edgeElement.getAttribute('data-node1'));
    const node2 = parseInt(edgeElement.getAttribute('data-node2'));
    const fa = []; // 并查集
    for (let i = 0; i < nodesCount; i++) {
        fa[i] = i;
    }
    function find(node) {
        if (fa[node] !== node) {
            fa[node] = find(fa[node]);
        }
        return fa[node];
    }
    for (let i = 0; i < op.length; i++) {
        fa[find(op[i].node1)] = find(op[i].node2);
    }
    if (!edgeElement.classList.contains('choosed') && find(node1) === find(node2)) { // 判环
        alert('这个边将会形成一个环');
        return;
    }
    const weight = parseInt(weightElement.innerText);
    if (edgeElement.classList.contains('choosed')) {
        edgeElement.classList.remove('choosed');
        for (let i = 0; i < op.length; i++) {
            if ((op[i].node1 === node1 && op[i].node2 === node2) || (op[i].node1 === node2 && op[i].node2 === node1)) {
                op.splice(i, 1);
                break;
            }
        }
        totalWeight -= weight; // 将边的权值从计数器中减去
    }
    else {
        edgeElement.classList.add('choosed');
        op.push({ node1, node2 });
        totalWeight += weight; // 将边的权值添加到计数器中
    }
    updateTotalWeight(); // 更新显示累加的权值
}
// 更新显示累加的权值
function updateTotalWeight() {
    const totalWeightElement = document.getElementById('totalWeight');
    if (totalWeightElement) {
        totalWeightElement.innerText = `Total weight selected: ${totalWeight}`;
    }
}
// 提交答案的点击事件处理程序
function submitAnswer() {
    KruskalAlgorithm(nodes, edges);
    const graphContainer = document.getElementById('graphContainer');
    if (!graphContainer)
        return;
    // 创建覆盖层
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgb(255, 255, 255)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';
    graphContainer.appendChild(overlay);
    // 结束提示信息
    const winMessage = document.createElement('div');
    winMessage.style.fontSize = '64px';
    winMessage.style.fontWeight = 'bold';
    winMessage.style.position = 'absolute';
    winMessage.style.top = '50%';
    winMessage.style.left = '50%';
    winMessage.style.transform = 'translate(-50%, -50%)';
    winMessage.style.zIndex = '2000';
    if (answer === totalWeight) {
        winMessage.innerText = 'You Win!!!';
        winMessage.style.color = 'green';
    }
    else {
        winMessage.innerText = 'Wrong Answer!!!';
        winMessage.style.color = 'red';
    }
    graphContainer.appendChild(winMessage);
    // 添加重新开始按钮元素
    const answerButton = document.createElement('button');
    answerButton.addEventListener('click', showCorrectAnswer); // 添加点击事件处理程序
    answerButton.className = "Button answerButton";
    answerButton.style.position = 'absolute';
    answerButton.style.left = '20px'; // 距离左边缘 1000px
    answerButton.style.top = '20px'; // 距离底部 20px
    answerButton.style.zIndex = '2000';
    answerButton.innerText = '查看答案';
    graphContainer.appendChild(answerButton);
}
function KruskalAlgorithm(nodes, edges) {
    // 按边的权值升序排序
    edges.sort((a, b) => a.weight - b.weight);
    // 初始化并查集
    const fa = []; // 并查集
    for (let i = 0; i < nodesCount; i++) {
        fa[i] = i;
    }
    function find(node) {
        if (fa[node] !== node) {
            fa[node] = find(fa[node]);
        }
        return fa[node];
    }
    // 开始遍历边
    for (const edge of edges) {
        const u = find(edge.from);
        const v = find(edge.to);
        // 如果边的两个节点不在同一连通分量中，则将它们连接起来，并将边加入最小生成树中
        if (u !== v) {
            answer += edge.weight;
            ans.push({ node1: edge.from, node2: edge.to, weight: edge.weight });
            fa[u] = v;
        }
    }
}
function showCorrectAnswer() {
    console.log(ans);
    const graphContainer = document.getElementById('graphContainer');
    if (!graphContainer)
        return;
    const edges = graphContainer.getElementsByClassName('edge');
    // 标记所有正确答案
    for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        edge.classList.remove('choosed');
        const node1 = parseInt(edge.getAttribute('data-node1'));
        const node2 = parseInt(edge.getAttribute('data-node2'));
        for (let j = 0; j < ans.length; j++) {
            const correctEdge = ans[j];
            const correctNode1 = correctEdge.node1;
            const correctNode2 = correctEdge.node2;
            if ((node1 === correctNode1 && node2 === correctNode2) || (node1 === correctNode2 && node2 === correctNode1)) {
                edge.classList.add('correct');
                break;
            }
        }
    }
    // 删除元素
    const allElements = graphContainer.querySelectorAll('*');
    const tmpArray = Array.from(allElements);
    tmpArray.forEach((elements) => {
        if (!elements.classList.contains('weight') && !elements.classList.contains('edge') && !elements.classList.contains('node') && !elements.classList.contains("refreshButton")) {
            elements.remove();
        }
    });
    // 创建覆盖层
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgb(255, 255, 255, 0)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';
    graphContainer.appendChild(overlay);
}
