"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataProxy = void 0;
Promise.OrderAll = function (promiseArray, that) {
    const arr = [];
    return new Promise(async (resolve) => {
        for (let index = 0; index < promiseArray.length; index++) {
            console.log("that:", that);
            let promiseItem = promiseArray[index].bind(that);
            let res = await promiseItem();
            arr.push(res);
        }
        resolve(arr);
    });
};
// 只能监听第一层数据
// Promise.OrderAll([sleep1(7000), sleep1(500)]).then((e: any) => {
//     console.log(e)
// })
class DataProxy {
    Data;
    ProxyFn;
    constructor(Data) {
        this.Data = Data;
        this.ProxyFn = [];
    }
    ProxyGet() {
        let that = this;
        let ProxyRenderData = new Proxy(this.Data, {
            get: function (target, key) {
                if (key in target) {
                    return target[key];
                }
            },
            set: function (target, key, value) {
                // console.log("触发set", target, key, value)
                target[key] = value;
                if (that.ProxyFn) {
                    Promise.OrderAll(that.ProxyFn, that.ProxyGet()).then((e) => {
                        // console.log("promise代理的结果:", e)
                    });
                }
                return true;
            }
        });
        return ProxyRenderData;
    }
    FnAdd(param) {
        // 判断是不是promise
        // if(typeof param.then==="function"){
        //     this.ProxyFn.push(param)
        //     return
        // }
        let temp = param.bind(this.ProxyGet());
        this.ProxyFn.push(temp);
    }
}
exports.DataProxy = DataProxy;
