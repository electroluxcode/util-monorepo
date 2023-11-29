"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chain = void 0;
/**
 * @des 链式调用数据
 */
class Chain {
    fn;
    nodeNext;
    // 一般会被当作初始数据
    ChainData;
    constructor(fn) {
        this.fn = fn;
        this.ChainData = {};
        this.nodeNext = null;
    }
    /**
     * @des 触发某一个事件
     * @param name
     * @param data 给function的值
     */
    emit = (name, data) => {
        if (this.ChainData.eventBus) {
            if (this.ChainData.eventBus[name]) {
                this.ChainData.eventBus[name].forEach((element) => {
                    element(data);
                });
            }
            else {
                throw new Error('没有这个事件');
            }
        }
    };
    /**
     * @des 初始化数据
     * @param data
     */
    dataSet(data) {
        this.ChainData = data;
    }
    /**
     * @des 异步进入下一个链条
     * @param args
     * @returns
     */
    asyncNext() {
        if (this.nodeNext) {
            this.nodeNext.dataSet(this.ChainData);
            return this.nodeNext.passRequest();
        }
        return this.fn();
    }
    nodeSet(nodeNext) {
        this.nodeNext = nodeNext;
    }
    passRequest() {
        // 执行这个方法
        const res = this.fn();
        if (res === 'chainNext') {
            if (this.nodeNext) {
                // 所有的函数都要用 chain 方法包起来，否则没有 this.nodeNext
                this.nodeNext.dataSet(this.ChainData);
                return this.nodeNext.passRequest();
            }
        }
        if (this.nodeNext) {
            this.nodeNext.dataSet(this.ChainData);
        }
        return res;
    }
}
exports.Chain = Chain;
/**
 * @des 初始化数据
 * @param this
 * @returns
 */
function initPost() {
    console.log('数据校验:');
    if (!this.ChainData.init) {
        this.emit("error", "使用者触发error事件");
        return;
    }
    return 'chainNext';
}
