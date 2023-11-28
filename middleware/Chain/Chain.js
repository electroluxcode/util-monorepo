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
     * @des settimeout的 异步
     * this.fn(...args) 不会返回值那么就要放到后面去 | 避免 return 判断。因为不会return 值
     * @param args
     * @returns
     */
    asycNext() {
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
/**
 * @des 异步数据
 * @returns
 */
const sleep = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                code: 200,
                data: [
                    { id: 1, name: "小明" }
                ]
            });
        }, 1000);
    });
};
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
/**
 * @des 异步逻辑
 * @param this
 */
async function asyncPost() {
    let data = await sleep();
    this.ChainData.res = data;
    this.asycNext();
}
/**
 * @des 异步逻辑
 * @param this
 */
async function lastPost() {
    this.emit("finish", "使用者触发finish事件");
}
// 1. 初始化 链条
const chainInitPost = new Chain(initPost);
const chainAsyncPost = new Chain(asyncPost);
const chainLastPost = new Chain(lastPost);
// 2. 设置关系 注意异步 用await 处理逻辑后调用 asyncNext 方法
chainInitPost.nodeSet(chainAsyncPost);
chainAsyncPost.nodeSet(chainLastPost);
// 3. 开始执行。从一开始的链条开始执行
chainInitPost.dataSet({
    init: {
        xml_id: "1111111111",
        model_id: "22222222"
    },
    eventBus: {
        finish: [
            (e) => {
                console.log(e);
                console.log(chainInitPost.ChainData.res);
            }
        ],
        error: [
            (e) => {
                console.log(e);
            }
        ]
    }
});
chainInitPost.passRequest();
export {};
// 请你理解这个程序设计方法并且 为小白用md写一篇教程。要注意md的美观和易懂。要把使用它的优点和注意点和边界点都指出来
// export { Chain };
