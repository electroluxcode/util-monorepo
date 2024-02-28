"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compose_js_1 = __importDefault(require("./compose.js"));
/**
 * 创建一个应用了所有中间件的Enhancer
 *
 * @param middlewares 多个中间件
 * @returns 一个应用了所有中间件的Enhancer
 */
function applyMiddleware(...middlewares) {
    return (createStore) => (reducer, preloadedState) => {
        const store = createStore(reducer, preloadedState);
        // 传入中间件中的store APIs
        const middlewareAPI = {
            getState: store.getState,
            dispatch: (action) => {
                dispatch(action);
            },
        };
        // 给每一个middleware传入SroeAPI，并且返回一个chain数组
        const chain = middlewares.map((middleware) => middleware(middlewareAPI));
        // 重写dispatch，应用中间件
        const dispatch = (0, compose_js_1.default)(...chain)(store.dispatch);
        return { ...store, dispatch };
    };
}
exports.default = applyMiddleware;
