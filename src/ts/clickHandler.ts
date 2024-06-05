let totalWeight = 0; // 用于累加边的权值
const op: { node1: number, node2: number }[] = [];

function selectClickHandler(event: MouseEvent) {
  const clicked = event.target as HTMLDivElement;
  let edgeElement, weightElement;
  if (clicked.classList.contains('weight')) {
    weightElement = clicked;
    edgeElement = clicked.parentElement as HTMLDivElement;
  }
  else if (clicked.classList.contains('edge')) {
    edgeElement = clicked;
    weightElement = clicked.querySelector('.weight') as HTMLDivElement;
  }
  else
    return;

  const node1 = parseInt(edgeElement.getAttribute('data-node1')!);
  const node2 = parseInt(edgeElement.getAttribute('data-node2')!);

  const dsu = new DSU(nodesCount);

  for (let i = 0; i < op.length; i++) {
    dsu.union(op[i].node1, op[i].node2);
  }

  if (!edgeElement.classList.contains('choosed') && dsu.same(node1, node2)) { // 判环
    alert('这个边将会形成一个环');
    return;
  }

  const weight = parseInt(weightElement.innerHTML);
  if (edgeElement.classList.contains('choosed')) {
    for (let i = 0; i < op.length; i++) {
      if ((op[i].node1 === node1 && op[i].node2 === node2) || (op[i].node1 === node2 && op[i].node2 === node1)) {
        op.splice(i, 1);
        break;
      }
    }
    totalWeight -= weight; // 将边的权值从计数器中减去
  } else {
    op.push({ node1, node2 });
    totalWeight += weight; // 将边的权值添加到计数器中
  }
  edgeElement.classList.toggle('choosed');

  // 更新显示累加的权值
  const totalWeightElement = document.querySelector('#totalWeight');
  if (totalWeightElement) {
    totalWeightElement.innerHTML = `Total weight selected: ${totalWeight}`;
  }
}

// 提交答案的点击事件处理程序
function submitAnswer() {
  KruskalAlgorithm(nodes, edges);

  const graphContainer = document.querySelector('#graphContainer');
  if (!graphContainer)
    return;

  // 创建覆盖层
  const overlay = createOverlay('white');
  graphContainer.appendChild(overlay);

  // 结束提示信息
  const winMessage = document.createElement('div');
  winMessage.classList.add('endMessage')

  if (correctAnswer === totalWeight) {
    winMessage.innerHTML = 'You Win!!!';
    winMessage.style.color = 'green';
  }
  else {
    winMessage.innerHTML = 'Wrong Answer!!!';
    winMessage.style.color = 'red';
  }

  graphContainer.appendChild(winMessage);


  function showCorrectAnswer(): void {
    console.log(ans);
    const graphContainer = document.querySelector('#graphContainer');
    if (!graphContainer)
      return;

    const edges = graphContainer.querySelectorAll('.edge');

    // 标记所有正确答案
    edges.forEach(edge => {
      edge.classList.remove('choosed');
      const node1 = parseInt(edge.getAttribute('data-node1')!);
      const node2 = parseInt(edge.getAttribute('data-node2')!);
      ans.forEach(correctEdge => {
        if (node1 === correctEdge.node1 && node2 === correctEdge.node2) {
          edge.classList.add('correct');
        }
      })
    })


    // 删除元素
    const elements = document.querySelectorAll('.submitButton, .answerButton, #totalWeight, .endMessage, .overlay');
    elements.forEach(element => element.remove());

    // 创建覆盖层
    const overlay = createOverlay('rgba(255, 255, 255, 0)');
    graphContainer.appendChild(overlay);
    // 添加查看答案按钮元素
  }

  const answerButton = createButton('查看答案', 'answerButton', showCorrectAnswer);
  graphContainer.appendChild(answerButton);
}