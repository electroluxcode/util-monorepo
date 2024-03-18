// zustand

// step1: create

/**
 const useXxxStore = create((set) => ({
  aaa: '',
  bbb: '',
  updateAaa: (value) => set(() => ({ aaa: value })),
  updateBbb: (value) => set(() => ({ bbb: value })),
}))

创造一个store，定义state和修改state的方法
然后中间件的设计跟 redux一样，create的参数是一个函数，那么就天生支持中间件

 */

import { createStore } from "./components/index.js";

// let useStore = createStore((set) => ({
// 	aaa: 1,
// 	update: (value) => {
// 		set({ aaa: value });
// 	},
// }));

// 知识点2：应用实例
// 如果是 usexxStore 一般是 usexxStore((state)=>state.xx)
// 然后 usexxStore 是 一个大框架 create 出来的实例
// (create 包含了订阅视图更新和实例化 store库的代码)

/**
 * @des 用来定义hook
 */
const useStore = (api, selector) => {
	api.subscribe(() => {
		render();
	});
	return selector(api.getState());
};

/**
 * @des 用来订阅更新
 * @param api
 */
let create = (api) => {
	let data = createStore(api);
	let sub = (selector) => {
		return useStore(data, selector);
	};
	Object.assign(sub, api);
	return [sub as any, data];
};

// 知识点3 :实例
let minusButton = document.querySelector(".minus");
let plusButton = document.querySelector(".plus");
let container = document.querySelector(".input")!;

let middlemare = (fn) => {
	return (set, get, api) => {
		let newSet = (...arg) => {
			console.log("新的set");
			return set(...arg);
		};
		return fn(newSet, get, api);
	};
};
let [useXXstore, api] = create(
	middlemare((set, get) => ({
		aaa: 0,
		updateAaa: (value) => set(() => ({ aaa: value })),
	}))
);

let aaa = useXXstore((state) => state.aaa);
let updateAaa = useXXstore((state) => state.updateAaa);

container.innerHTML = aaa;
const render = () => {
	// store.getState();这是返回他的数据
	// console.log("render");
	container.innerHTML = api.getState().aaa;
};

minusButton?.addEventListener("click", () => {
	// let temp = api.getState().aaa - 1;
	// let temp = ;

	// updateAaa(temp);
	api.setState({
		aaa: api.getState().aaa - 1,
	});
});
plusButton?.addEventListener("click", () => {
	// let temp = api.getState().aaa + 1;

	// updateAaa(temp);
	api.setState({
		aaa: api.getState().aaa + 1,
	});
});
