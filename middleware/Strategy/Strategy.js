/**
 * @des 要求用户的 action 方法传入
 */
class Strategy {
    MapHash;
    config;
    constructor(config) {
        this.config = Object.assign({}, config);
        this.MapHash = new Map();
    }
    /**
     * @des 重新排序
     */
    HashMapGen(HashKey) {
        const orderedMap = new Map();
        const sortedKeys = Object.keys(HashKey).sort();
        // 整体的key，局部的key-value
        for (const key of sortedKeys) {
            orderedMap.set(HashKey[key], HashKey[key]);
        }
        return JSON.stringify(Object.fromEntries(orderedMap));
    }
    /**
     * @des 属性 和 方法
     * @param HashKey 属性object array数组
     * @param HashFn 方法
     */
    ActionAdd(HashKey, HashFn) {
        let Key = this.HashMapGen(HashKey);
        this.MapHash.set(Key, HashFn);
    }
    /**
   * @des 触发某一个事件
   * @param name
   * @param data 给function的值
   */
    emit = (name, data) => {
        if (this.config.eventBus) {
            if (this.config.eventBus[name]) {
                this.config.eventBus[name].forEach((element) => {
                    element(data);
                });
            }
            else {
                throw new Error('utilmonorepo默认提示:没有这个事件');
            }
        }
    };
    ActionExecute(HashKey, that) {
        let Key = this.HashMapGen(HashKey);
        if (!this.MapHash.get(Key)) {
            this.emit("default", "utilmonorepo默认提示:触发默认方法");
            return;
        }
        let Fn = this.MapHash.get(Key);
        if (that) {
            Fn.bind(that);
        }
        else {
            Fn.bind(this);
        }
        try {
            Fn();
        }
        catch {
            this.emit("error", "utilmonorepo默认提示:报错示例");
        }
    }
}
export { Strategy };
