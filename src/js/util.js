"use strict";
// 并查集
class DSU {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
    }
    find(x) {
        return this.parent[x] === x ? x : (this.parent[x] = this.find(this.parent[x]));
    }
    union(x, y) {
        this.parent[this.find(x)] = this.find(y);
    }
    same(x, y) {
        return this.find(x) === this.find(y);
    }
}
// 获取一个随机整数
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// 刷新页面
function refreshPage() { location.reload(); }
