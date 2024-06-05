// 并查集
class DSU {
  private parent: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
  }

  find(x: number): number {
    return this.parent[x] === x ? x : (this.parent[x] = this.find(this.parent[x]));
  }

  union(x: number, y: number): void {
    this.parent[this.find(x)] = this.find(y);
  }

  same(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }
}

// 获取一个随机整数
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 刷新页面
function refreshPage(): void { location.reload(); }

