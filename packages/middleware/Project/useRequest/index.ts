import Fetch from "./Fetch.js";

const service = () => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ id: 4 });
		}, 1000);
	});
};
let fetchOptions = {
	manual: false,
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
	const { manual = false, ...rest } = options;

	let initState = plugins.map((p) => p?.onInit?.(fetchOptions)).filter(Boolean);
	console.log(initState, "ddddddddd");
	const fetchInstance = new Fetch(
		service,
		fetchOptions,
		// constructor | cancel | mutate | runAsync(初始化来一次loading )
		options.subscribe ??
			function (e) {
				console.log("订阅:", JSON.parse(JSON.stringify(e)));
			},
		Object.assign({}, ...initState)
	);
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
let { loading, run } = useRequest(service, {
	manual: true,
	subscribe: (e) => {
		console.log("ddd", e);
	},
	retryCount: 2,
});

setTimeout(() => {
	run();
}, 100);
