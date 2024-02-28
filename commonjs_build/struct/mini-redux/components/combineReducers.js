"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 将传入的多个不同的reducers合并成一个reducer
 *
 * @param {object} reducers 存有多个不同reducers的对象
 *
 * @returns 一个调用了所有传入reducers的reducer函数，并且会返回相同结构的状态
 */
function combineReducers(reducers) {
    // 返回新的reducer函数
    return function combination(state = {}, action) {
        const nextState = {};
        // 遍历reducers
        for (const key in reducers) {
            // 上一个state在当前key上的值
            const previousStateForKey = state[key];
            // 下一个state在当前key上的值
            const nextStateForKey = reducers[key](previousStateForKey, action);
            // 将最新的值赋值给nextState对应的key
            nextState[key] = nextStateForKey;
            // 判断是否发生变化, 一个为false，hasChange一定为false
        }
        // 如果状态改变，则返回最新状态，否则返回没有改变的旧状态
        return nextState;
    };
}
exports.default = combineReducers;
