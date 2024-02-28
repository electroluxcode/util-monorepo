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
	// 绑定action 和 getter
	let thatState = prop.state;
	let actionsKey = { ...prop.actions };
	Object.keys(actionsKey).forEach((e) => {
		actionsKey[e] = actionsKey[e].bind({ ...prop.actions });
	});
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
				console.log("--代理--", target, thisArg, argumentsList);
				return target.apply(thisArg, argumentsList);
			},
		};
		// new Proxy(targetObject.foo, functionInvocationHandler);
		for (let i in actionsKey) {
			proxy[i] = new Proxy(actionsKey[i], functionInvocationHandler);
		}
		console.log("proxy:", proxy, prop);
		return { ...proxy, ...prop.state, ...prop.getters };
	};
}
let b = defineStore({
	id: 2,
	state: {
		name: "woni",
		sex: "",
	},
	getters: {
		// state
		compute() {
			return this.name + "--我是compute";
		},
	},
	actions: {
		stateChange(id) {},
		anotherChange: function anotherChange(name) {
			console.log("anotherChange:", name, this);
			this["name"] = name;
			console.log("anotherChange:", name, this);
		},
	},
});
let bcase = b();
console.log(bcase.name);
bcase.anotherChange("xiaoming");
console.log(bcase.name);

// let hello = function () {
// 	this["id"] = 455;
// 	console.log(this);
// };
// const functionInvocationHandler = {
//     apply: function (target, thisArg, argumentsList) {
//         // console.log(target, thisArg, argumentsList);
//         console.log("--代理--", target, thisArg, argumentsList);
//         // target.bind(thisArg)("ceshi");
//         return target.apply(thisArg, argumentsList);
//     },
// };
// let paran = { id: 5 }
// const proxy = {id:new Proxy(hello.bind(paran), functionInvocationHandler)};
// proxy.id(paran)

// console.log("最后的this:",paran)
const createProxy = (input, fn) => {
	let proxy = {};
	// new Proxy(targetObject.foo, functionInvocationHandler);
	for (let i in input) {
		proxy[i] = new Proxy(input[i].bind({ ...paran }), fn);
	}
	return proxy;
};
export {};
// 代理方法
// const proxy = new Proxy(hello.bind(paran), functionInvocationHandler);
// proxy(paran)
// let c ={
//     hello : function () {
//         console.log(this);
//         this["id"] = 3;
//         console.log(this);
//         this["id"] = 455;
//         console.log(this);
//     }
// }
// const proxy =  createProxy(c, functionInvocationHandler);
// // proxy(paran)
// console.log("最后的proxy:",proxy.hello())
// console.log("最后的this:",paran)
