"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 将函数从右向左组合起来
 *
 * @param funcs 要组合的函数
 * @returns 组合后的函数
 */
function compose(...funcs) {
    // 只传入一个函数时，直接返回它
    if (funcs.length === 1) {
        return funcs[0];
    }
    // 如果传入多个函数
    // 把函数链接成一个链条，按顺序，一个一个执行
    return funcs.reduce((composed, func) => (...args) => composed(func(...args)));
}
exports.default = compose;
