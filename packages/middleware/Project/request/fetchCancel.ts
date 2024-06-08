/**
 @des 取消重复请求:原理管理signal进行去重
 1. 新增
  1.1 把前一个暂停掉（value是abortController的删掉然后调用abort接口）
  1.2 method + url 拼接成一个新的 作为key,然后new AbortController() 作为新的 value
 */

import { easyFetch } from "./easyFetch.js";

// 用于存储每个请求的标识和取消函数
const pendingMap = new Map<string, AbortController>();

const getPendingUrl = (config: any): string => {
	return [config.method, config.url].join("&");
};
export class fetchCanceler {
	/**
	 * 添加请求
	 * @param config 请求配置
	 */
	public addPending(config: any): void {
		this.removePending(config);

		// 生成 map 的 key
		const url = getPendingUrl(config);
		const controller = new AbortController();
		config.signal = config.signal || controller.signal;
		if (!pendingMap.has(url)) {
			// 如果当前请求不在等待中，将其添加到等待中
			pendingMap.set(url, controller);
		}
	}

	/**
	 * 移除请求
	 * @param config 请求配置
	 */
	public removePending(config: any): void {
		const url = getPendingUrl(config);
		if (pendingMap.has(url)) {
			// 如果当前请求在等待中，取消它并将其从等待中移除
			const abortController = pendingMap.get(url);
			if (abortController) {
				abortController.abort(url);
			}
			pendingMap.delete(url);
		}
	}
	/**
	 * 清除所有等待中的请求
	 */
	public removeAllPending(): void {
		// map 的 foreach直接是 value
		pendingMap.forEach((abortController) => {
			if (abortController) {
				abortController.abort();
			}
		});
		this.reset();
	}
	/**
	 * 重置
	 */
	public reset(): void {
		pendingMap.clear();
	}
}

/** 最简示例
let params = {
	data: {
		id: 5,
	},
	url: "https://api.github.com/users/Electroluxcode",
	method: "get",
};
const fetchCancelerCase = new fetchCanceler();
fetchCancelerCase.addPending(params);
fetch(params.url, params).then((e)=>{
	console.log(e)
});
fetchCancelerCase.removePending(params);


fetch("baidu.com").then((e)=>{
	console.log(e)
});

 * 
*/

// method + url 拼接成一个新的 作为key
// 用 浅复制的特性将 signal进行传递
// let params = {
// 	data: {
// 		id: 5,
// 	},
// 	url: "/users/Electroluxcode",
// 	method: "get",
// };
// // step1:需要在请求之前提前创造(请求拦截器)
// const fetchCancelerCase = new fetchCanceler();

// // 请求接口
// let ba = new easyFetch({
// 	baseURL: "https://api.github.com",
// 	responseOptions: {
// 		type: "json",
// 	},
// 	transform: {
// 		requestInterceptors: (axiosInstance, config) => {
// 			fetchCancelerCase.addPending(config);
// 		},
// 		responseInterceptors: (axiosInstance, config) => {
// 			fetchCancelerCase.removePending(config);
// 		},
// 	},
// });
// ba.request(params);
// ba.request(params);
// step2: 请求之后移除(响应拦截器)
