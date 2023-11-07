/**
 * @des Cache 缓存
 * @fn setData | getData | deleteData | addData 四个方法
 * @eg
 */
class Cache {
    cacheData;
    constructor() {
        this.cacheData = {};
    }
    /**
     * @des 存单个数据进去
     * @param name
     * @param item
     */
    setData(name, item) {
        this.cacheData[name] = item;
    }
    /**
     * @des 获取某一个 key
     * @param name
     * @returns
     */
    getData(name) {
        const res = this.cacheData[name];
        return res;
    }
    /**
     * @des 删掉某一个
     * @param name
     */
    deleteData(name) {
        this.cacheData[name] = [];
    }
    addData(name, data) {
        if (this.cacheData[name].length) {
            this.cacheData[name].push(data);
        }
        else {
            this.cacheData[name] = [];
            this.cacheData[name].push(data);
        }
    }
}
export default new Cache();
