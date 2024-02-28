import compose from './compose.js';

/**
 * 创建一个应用了所有中间件的Enhancer
 *
 * @param middlewares 多个中间件
 * @returns 一个应用了所有中间件的Enhancer
 */
export default function applyMiddleware(...middlewares) {
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
    const dispatch = compose(...chain)(store.dispatch);

    return { ...store, dispatch };
  };
}
