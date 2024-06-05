// 检查节点之间的距离
function checkDistance(nodes: { x: number, y: number }[], x: number, y: number): boolean {
  for (const node of nodes) {
    const distance = Math.hypot(node.x - x, node.y - y);
    if (distance < 100) {
      return false;
    }
  }
  return true;
}

// 创建节点元素
function createNode(id: number, x: number, y: number): HTMLDivElement {
  const node = document.createElement('div');
  node.classList.add('node');
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
  node.innerHTML = id.toString();
  return node;
}

// 创建边元素
function createEdge(node1: { id: number, x: number, y: number }, node2: { id: number, x: number, y: number }): HTMLDivElement {
  const x1 = node1.x + 15, y1 = node1.y + 15;
  const x2 = node2.x + 15, y2 = node2.y + 15;

  const edge = document.createElement('div');
  edge.classList.add('edge');

  const distance = Math.hypot(x2 - x1, y2 - y1);
  edge.style.width = `${distance}px`; // 使用两点之间的距离作为边的长度

  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  edge.style.transform = `rotate(${angle}deg)`;

  edge.style.left = `${x1}px`;
  edge.style.top = `${y1}px`;

  const weight = document.createElement('div');
  weight.classList.add('weight');
  weight.innerHTML = Math.round(distance / 100).toString(); // 使用两点之间的距离作为边的权值

  weight.style.transform = `rotate(${-angle}deg)`;

  edges.push({ u: node1.id, v: node2.id, weight: Math.round(distance / 100) });
  edge.appendChild(weight);

  edge.setAttribute('data-node1', node1.id.toString());
  edge.setAttribute('data-node2', node2.id.toString());

  return edge;
}

//创建按钮元素
function createButton(text: string, classname: string, clickHandler: () => void): HTMLButtonElement {
  const button = document.createElement('button');
  button.classList.add('button');
  button.classList.add(classname);
  button.addEventListener('click', clickHandler);
  button.innerHTML = text;
  return button;
}

// 创建遮罩层
function createOverlay(backgroundColor: string): HTMLDivElement {
  const overlay = document.createElement('div');
  overlay.style.backgroundColor = backgroundColor;
  overlay.classList.add('overlay');
  return overlay;
}