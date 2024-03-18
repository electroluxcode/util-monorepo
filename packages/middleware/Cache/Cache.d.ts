/**
 * @des Cache 缓存
 * @fn setData | getData | deleteData | addData 四个方法
 * @eg
 */
declare class Cache {
    #private;
    constructor();
    /**
     * @des 存单个数据进去
     * @param name
     * @param item
     */
    setData(name: string, item: any): void;
    /**
     * @des 获取某一个 key
     * @param name
     * @returns
     */
    getData(name: string): any[];
    /**
     * @des 删掉某一个
     * @param name
     */
    deleteData(name: string): void;
    addData(name: string, data: any): void;
}
declare let test: Cache;
export default test;
export { test as Cache };
