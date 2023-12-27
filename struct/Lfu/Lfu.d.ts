interface Basic {
    value: any;
    fre: number;
    key: any;
}
declare class Lfu {
    Size: number;
    Cache: Map<any, Basic>;
    constructor(size: number);
    get(key: any): any;
    /**
     * @des 最简单的可以筛选出最小的 值 然后进行比较
     * @param key
     * @param value
     * @returns
     */
    put(key: any, value: any): void;
}
export { Lfu };
