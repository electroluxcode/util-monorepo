import { createStore, combineReducers, compose } from "./index.js";
// import { loggerEnhancer, anotherLoggerEnhancer } from './src/example/enhancer.js';
let enhanceFn1 = (createStore) => {
    return (reducer, state) => {
        const store = createStore(reducer, state);
        const newHancer = (action) => {
            store.dispatch(action);
            console.log("这是我的增强方法1");
        };
        return {
            ...store,
            dispatch: newHancer,
        };
    };
};
// 目前来看，最大的坏处是采用了分离式的设计理念，导致了ts不能够定义
// 值得学习的点，combineXX 将 事务分离成多个
// 例如  XX 本身是 (state,action)
let combine1 = (state, action) => {
    console.log("我是combine1:", state, action);
};
let combine2 = (state, action) => {
    console.log("我是combine2:", state, action);
};
let combineFn = (combines) => {
    return;
};
// 知识点1：
const reducer = (state = 0, action) => {
    console.log("reducer触发");
    switch (action.type) {
        case "counter/increment":
            return state + 1;
        case "counter/decrement":
            return state - 1;
        default:
            return state;
    }
};
const reducer2 = (state = 0, action) => {
    console.log("reducer22222222222触发", state);
    switch (action.type) {
        case "counter/increment":
            return state + 100;
        case "counter/decrement":
            return state - 100;
        default:
            return state;
    }
};
// 知识点2:createStore
// 传入 reducer state enhance
const store = createStore(combineReducers({ reducer, reducer2 }), 30, 
// null
compose(enhanceFn1));
console.log("createStore:", store);
// 知识点2.1 getState
// 首先是 getState 的构造，就是直接返回值就好了
// let storeState = store.getState();
// console.log("storeState:", storeState);
// 知识点2.2 dispatch
// 就是 将 参数 传递给 createStore 的 reducer 的第二个参数并且执行方法
// 然后 调用正在订阅中的监听器 listener
// store.dispatch({ type: "counter/decrement" });
// store.dispatch({ type: "counter/decrement" });
// console.log("storeState:", store.getState());
// 知识点2.3 enhance
// az
// 2.3.1 先讲一下 enhancer 的格式 ，传参传入 createStore
// createStore(reducer, state) 然后 return 的 function 传入一个 reducer 和 store
// 然后 这里可以写 新的 dispatch 插入新的 dispatch
// 简单的说 enhancer(createStore)(reducer,store)  // reducer 可以随便加
// 2.3.2 然后 说一下 中间件，中间件其实也是要包装成 enhance 的格式
// 需要一个工具函数 applyMiddleware ,内部实现是 先 map一波传入 middlewareapi 然后用 compose 组合然后 传入 dispatch
// 和一个传入 的高度定制的 函数 (MiddlewareApi)=>(Dispatch)=>(type)，一般我们是两层，但是这里有三层
// 也就是说可以 在第一层去做文章，其他的格式仍然是 dispatch
// 2.3.3 然后是createStore的实现，createStore如果第三个参数存在 那么会返回一个全新的 store
// enhancer(createStore)(reducer, preloadedState)
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
        // 给每一个middleware传入middlewareAPI，并且返回一个chain数组
        const chain = middlewares.map((middleware) => middleware(middlewareAPI));
        // 重写dispatch，应用中间件
        const dispatch = newCompose(...chain)(store.dispatch);
        return { ...store, dispatch };
    };
}
let newCompose = (...args) => {
    return (param) => {
        return args.reduce((all, now) => {
            return now(all);
        }, param);
    };
};
const loggerMiddleware = (middlewareAPI) => (dispatch) => async (action) => {
    // await getList()
    console.log("I am a Middleware!!!");
    dispatch(action);
};
// const storeEn = createStore(
// 	combineReducers([reducer2]),
// 	30,
// 	newCompose(applyMiddleware(loggerMiddleware))
// 	// compose(enhancer, applyMiddleware(loggerMiddleware))
// );
// storeEn.dispatch({ type: "" });
// 知识点3 :实例
let minusButton = document.querySelector(".minus");
let plusButton = document.querySelector(".plus");
let container = document.querySelector(".input");
minusButton?.addEventListener("click", () => {
    store.dispatch({ type: "counter/decrement" });
});
plusButton?.addEventListener("click", () => {
    store.dispatch({ type: "counter/increment" });
});
container.innerHTML = store.getState().reducer;
const render = () => {
    // store.getState();这是返回他的数据
    console.log("render:", store.getState());
    container.innerHTML = store.getState().reducer;
};
store.subscribe(render);
