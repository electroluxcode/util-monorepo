"use strict";
// Lru(int capacity) 以 正整数 作为容量 capacity 初始化 LRU 缓存
// int get(int key) 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1 。
// void put(int key, int value) 如果关键字 key 已经存在，则变更其数据值 value ；如果不存在，则向缓存中插入该组 key-value 。如果插入操作导致关键字数量超过 capacity ，则应该 逐出 最久未使用的关键字。
// 函数 get 和 put 必须以 O(1) 的平均时间复杂度运行。
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lru = void 0;
class Lru {
    Cache;
    Fre;
    Capacity;
    constructor(capacity) {
        this.Capacity = capacity;
        this.Cache = new Map();
    }
    get(key) {
        if (this.Cache.has(key)) {
            let temp = this.Cache.get(key);
            this.Cache.delete(key);
            this.Cache.set(key, temp);
            return temp;
        }
        return -1;
    }
    put(key, value) {
        if (this.Cache.has(key)) {
            // 存在即更新（删除后加入）
            this.Cache.delete(key);
        }
        if (this.Cache.size >= this.Capacity) {
            // 缓存超过最大值，则移除最近没有使用的，也就是 map 的第一个 key
            this.Cache.delete(Array.from(this.Cache)[0][0]);
        }
        this.Cache.set(key, value);
    }
}
exports.Lru = Lru;
