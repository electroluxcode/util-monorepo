// 手写zustand
// 知识点1:(开发者)createStore设计理念是传入一个函数，get ,set ,api 传入这个函数，返回的是 一个object里面带着这些
// 知识点2:(开发者)useStore-实例化state工具-订阅框架更新，传入 用来返回一个seletor的store，
// 知识点3:(开发者)create 设计的时候，两个作用，利用createstore实例化，然后实例化 selector的函数，返回这个函数
// 知识点4:(使用者):中间的开发
export const createStore = (createState) => {
    let state;
    let listeners = new Set();
    let subscribe = (fn) => {
        listeners.add(fn);
    };
    let destory = () => {
        listeners.clear();
    };
    let getState = () => state;
    let setState = (fn, replace) => {
        let prevState = state;
        // let nextState = fn(state);
        const nextState = typeof fn === "function" ? fn(state) : fn;
        if (nextState != state) {
            // state = nextState;
            if (replace) {
                state = nextState;
            }
            else {
                if (typeof state == "object") {
                    Object.assign(state, nextState);
                }
                else {
                    state = nextState;
                }
            }
            listeners.forEach((e) => {
                e(state, prevState);
            });
        }
    };
    let api = { getState, setState, destory, subscribe };
    state = createState(setState, getState, api);
    return api;
};
const render = () => { };
// let useStore = (api, selector) => {
// 	api.subscribe(() => {
// 		render();
// 	});
// 	return selector(api.getState());
// };
// const create = (createState) => {
// 	let api = createStore(createState);
// 	let selector = (param) => {
// 		useStore(api, param);
// 	};
// 	return selector;
// };
let useStore = (api, selector) => {
    api.subscribe(() => { });
    return selector(api.getState());
};
let create = (api) => {
    let data = createStore(api);
    let selector = (se) => useStore(api, se);
    return selector;
};
// 实例化
// const render = () => {};
// const useStore = (api, selector) => {
// 	api.subscribe(() => {
// 		render();
// 	});
// 	return selector(api.getState());
// };
// // 感觉create 有点问题 别的还好
// const create = (api) => {
// 	let apiT = createStore(api);
// 	let state = (selector) => useStore(api, selector);
// 	return state;
// };
