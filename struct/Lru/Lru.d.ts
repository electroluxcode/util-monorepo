declare class Lru {
    Cache: Map<any, any>;
    Fre: any;
    Capacity: number;
    constructor(capacity: number);
    get(key: any): any;
    put(key: any, value: any): void;
}
export { Lru };
