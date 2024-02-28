type createStoreReturn = {
	getState: () => any;
	dispatch: (action: Record<any, any>) => typeof action;
	subscribe: (action: () => any) => () => any;
};

/**
 * 创建store对象
 *
 * @param {function} reducer
 * @param {*} preloadedState
 * @param {function} enhancer
 * @returns store对象
 */
export default function createStore(
	reducer,
	preloadedState,
	enhancer
): createStoreReturn {
	// 当省略了preloadedState，直接传入 enhancer 时
	if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
		enhancer = preloadedState;
		preloadedState = undefined;
	}

	// 如果传入了enhancer，就返回enhancer
	if (typeof enhancer === "function") {
		return enhancer(createStore)(reducer, preloadedState);
	}

	// 初始化状态和监听器
	let state = preloadedState;
	const listeners: (() => void)[] = [];

	/**
	 * 读取Store中的状态
	 *
	 * @returns 应用当前的状态
	 */
	function getState() {
		return state;
	}

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

	/**
	 * 发送一个Action，这是在Redux改变状态的唯一途径
	 *
	 * @param {object} action 普通的JS对象，来描述发生了什么改变
	 *
	 * @returns 返回action本身
	 */
	function dispatch(action) {
		// 调用reducer，将最新的state赋值给state
		state = reducer(state, action);

		// 依次调用正在订阅中的监听器
		listeners.forEach((listener) => listener());
		// 返回action本身
		return action;
	}

	// 当一个Store被创建时，会自动发送INIT Action，这样做可以初始化状态
	dispatch({ type: "@@redux/INIT" });

	// 返回写好的接口
	return {
		getState,
		dispatch,
		subscribe,
	};
}
