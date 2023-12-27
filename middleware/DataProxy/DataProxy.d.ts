declare class DataProxy {
    Data: any;
    ProxyFn: Array<Function>;
    [key: string]: any;
    constructor(Data: any);
    ProxyGet(): any;
    FnAdd(param: any): void;
}
export { DataProxy };
