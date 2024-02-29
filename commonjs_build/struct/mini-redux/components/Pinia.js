"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineStore = void 0;
function defineStore(prop) {
    const listeners = [];
    /**
     * 添加监听器
     *
     * @param {function} listener 每次Dispatch后都会被调用的回调函数
     * @returns 移除当前函数的订阅
     */
    function subscribe(listener) {
        // 添加一个回调函数
        listeners.push(listener);
        return function unsubscribe() {
            // 拿到当前回调函数的索引
            const index = listeners.indexOf(listener);
            // 根据索引删除当前回调函数
            listeners.splice(index, 1);
        };
    }
    let gettersKey = { ...prop.getters };
    Object.keys(gettersKey).forEach((e) => {
        gettersKey[e] = gettersKey[e].bind({ ...prop.actions });
    });
    return () => {
        /**
         * @des 传入对象
         * @param input 对象
         * @param fn 代理方法
         * @returns 返回代理
         */
        let proxy = {};
        // 代理方法
        const functionInvocationHandler = {
            apply: function (target, thisArg, argumentsList) {
                // 通知中间件
                if (prop.enhancer) {
                    Object.keys(prop.enhancer).forEach((en) => {
                        prop.enhancer[en]();
                    });
                }
                // 通知订阅者
                queueMicrotask(() => {
                    listeners.forEach((listener) => listener({ ...prop.state }, { ...prop.state }));
                });
                return target.apply(thisArg, argumentsList);
            },
        };
        let actionsKey = { ...prop.actions };
        Object.keys(actionsKey).forEach((e) => {
            proxy[e] = new Proxy(actionsKey[e], functionInvocationHandler);
        });
        // new Proxy(targetObject.foo, functionInvocationHandler);
        for (let i in actionsKey) {
            proxy[i] = new Proxy(actionsKey[i], functionInvocationHandler);
        }
        return { ...proxy, ...prop.state, ...prop.getters, subscribe };
    };
}
exports.defineStore = defineStore;
