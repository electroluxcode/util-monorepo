import Fetch from "./Fetch.js";
import useRetryPlugin from "./plugins/useRetryPlugin.js";
import useAutoRunPlugin from "./plugins/useAutoRunPlugin.js";
const service = (test) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (Math.random() > 0.9) {
				resolve(test);
			} else {
				reject(test);
			}
			// resolve(test);
		}, test);
	});
};

let initState = {
	loading: true,
};
/**
 * run 逻辑 | runAsync 逻辑
 1.option 判断一下 returnNow(立刻return promise.resolve(state.data)) 和 stopNow(立刻return promise)
 2.马上 setState 
 3.onBefore 传入一个 param(runPluginHandler 暴露出onbefore事件)
 4.try 里面写一个 await servicePromise 针对promise 进行管理.(runPluginHandler 暴露出onRequest)
    4.1.try完成后 setState +  runPluginHandler onSuccess 方法和 onFinally 方法
    4.2.catch setState runPluginHandler onError 方法和 onFinally 方法
   

总结一下,假如直接run那么会调用三次,
初始化的时候 | run  |最后结束的时候也要手动调用一次 setState

设计思想是用 run 作为一个代理，run里面写入生命周期等增强方法

 */
import type {
	Service,
	UseRequestOptions,
	UseRequestPlugin,
	UseRequestResult,
} from "./types";

const useRequest = <TData, TParams extends any[]>(
	service: Service<TData, TParams>,
	options: UseRequestOptions<TData, TParams> = {},
	plugins: UseRequestPlugin<TData, TParams>[] = []
) => {
	// fetchOptions:user config
	const { manual = false, ...rest } = options;
	let fetchOptions = {
		manual: false,
		...rest,
	};
	let resPlugins = [
		useRetryPlugin,
		useAutoRunPlugin,
		...plugins,
	] as UseRequestPlugin<TData, TParams>[];

	let initState = resPlugins
		.map((p) => p?.onInit?.(fetchOptions))
		.filter(Boolean);

	const DefaultSubFn = (e) => {
		console.log("defaultSubscribe:", JSON.parse(JSON.stringify(e)));
	};
	const fetchInstance = new Fetch(
		service,
		fetchOptions,
		// constructor | cancel | mutate | runAsync(初始化来一次loading )
		options.subscribe ?? DefaultSubFn,
		Object.assign({}, ...initState)
	);
	fetchInstance.options = fetchOptions;
	// run all plugins hooks | casely
	fetchInstance.pluginImpls = resPlugins.map((p) => {
		return p(fetchInstance, fetchOptions);
	});

	if (!manual) {
		const params = fetchInstance.state.params || options.defaultParams || [];
		// @ts-ignore
		fetchInstance.run(...params);
	}

	return {
		...fetchInstance.state,
		cancel: fetchInstance.cancel.bind(fetchInstance),
		mutate: fetchInstance.mutate.bind(fetchInstance),
		refresh: fetchInstance.refresh.bind(fetchInstance),
		refreshAsync: fetchInstance.refreshAsync.bind(fetchInstance),
		run: fetchInstance.run.bind(fetchInstance),
		runAsync: fetchInstance.runAsync.bind(fetchInstance),
	} as UseRequestResult<TData, TParams>;
};

import { easyFetch } from "./easyFetch.js";

let params: CreateAxiosOptions = {
	params: {
		id: 5,
	},
	url: "/use333rs/Electroluxcode",
	method: "get",
};
let fetchHook = new easyFetch({
	responseOptions: {
		type: "json",
	},
	baseURL: "https://api.github.com",
});
const userGet = () => {
	return fetchHook.request(params);
};

let { loading, run } = useRequest(service, {
	manual: true,
	subscribe: (e) => {
		// if()
		// console.log("subscribe:", e);
	},
	onSuccess(data) {
		console.log("success:", data);
	},
	retryCount: 2,
	retryInterval: 1000,
});
setTimeout(() => {
	// 永远拿到的是后面发送的值，例如下面的例子 run 3秒后发射
	run(3000);

	// userGet().then((e) => {
	// 	console.log("测试", e);
	// });
}, 100);
