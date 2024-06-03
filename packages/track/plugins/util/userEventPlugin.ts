///<reference path = "base.d.ts" />
interface returnItemType extends returnItemBaseType {
	type: "userEvent";
	// 当前界面的url
	url: any;
	extraInfo: {
		type?: "xhr" | "fetch" | "click" | "router";

		// 请求方式
		method?: string;
		// 尝试请求的url
		url?: string;
		startTime?: any;
		reqData?: any;
		status?: any;
		// 接口请求总时长
		elapsedTime?: any;

		id?: string;
		class?: string;
		tag?: string;
	};
	children?: returnItemType[];
}

class LruArrayCache {
	len = 3;
	cache = [];
	constructor(length) {
		this.len = length;
	}
	get() {
		return this.cache;
	}
	add(value) {
		// 如果没有key 首先判断 length
		if (this.cache.length >= this.len) {
			this.cache.shift();
		}
		this.cache.push(value);
	}
}

class userEventPlugin {
	trackConfigData;
	collectData: LruArrayCache;
	constructor(obj = { trackSend: () => {}, trackConfig: {} }) {
		this.trackConfigData = obj;
		this.collectData = new LruArrayCache(30);
	}
	autoRun() {
		this.util();
		this.xhrCollect;
	}
	/**
	 * @des 1.收集xhr事件
	 */
	xhrCollect() {
		let that = this;
		if (!("XMLHttpRequest" in window)) {
			return;
		}
		let message: Record<string, returnItemType> = {};
		const originalXhrProto = XMLHttpRequest.prototype.open;

		let urlKey;
		// 第一个参数是 请求的方式 第二个参数是请求的url
		XMLHttpRequest.prototype.open = function (...args) {
			urlKey = args[1];
			message[urlKey] = {
				type: "userEvent",
				url: window.location.href,
				extraInfo: {},
			};
			message[urlKey]["extraInfo"] = {
				type: "xhr",
				startTime: new Date().getTime(),
				method: typeof args[0] === "string" ? args[0].toUpperCase() : args[0],
				url: urlKey,
			};

			originalXhrProto.apply(this, args);
		};

		const originalSend = XMLHttpRequest.prototype.send;
		// 第一个参数是 bodyinit
		XMLHttpRequest.prototype.send = function (...args) {
			console.log("劫持成功-send:", args);
			let cacheKey = urlKey;
			this.addEventListener("loadend", () => {
				console.log("this:", this);
				const { responseType, response, status } = this;
				const endTime = new Date().getTime();
				message[cacheKey]["extraInfo"]["reqData"] = args[0];
				message[cacheKey]["extraInfo"]["status"] = status;
				if (["", "json", "text"].includes(responseType)) {
					message["responseText"] =
						typeof response === "object" ? JSON.stringify(response) : response;
				}
				// 获取接口的请求时长
				message[cacheKey]["extraInfo"]["elapsedTime"] =
					endTime - message[cacheKey]["extraInfo"]["startTime"];

				// 上报xhr接口数据
				that.collectData.add(message[cacheKey]);
				console.log("最终上报的数据:", that.collectData.get());
				Reflect.deleteProperty(message, cacheKey);
			});
			// 执行原始的send方法
			originalSend.apply(this, args);
		};
	}
	/**
	 * @des 2.收集fetch事件
	 */
	fetchCollect() {
		let that = this;
		if (!("fetch" in window)) {
			return;
		}
		const originFetch = fetch;
		// @ts-ignore
		fetch = function (url, config) {
			const sTime = new Date().getTime();
			const method = (config && config.method) || "GET";
			let handlerData: returnItemType = {
				type: "userEvent",
				url: window.location.href,
				extraInfo: {},
			};

			return originFetch.apply(window, [url, config]).then(
				(res) => {
					// res.clone克隆，防止被标记已消费
					const tempRes = res.clone();
					const eTime = new Date().getTime();
					handlerData["extraInfo"] = {
						elapsedTime: eTime - sTime,
						status: tempRes.status,
						method,
						reqData: config && config.body,
						url,
					};
					// 暂时不考虑.json,这个东西容易出错
					tempRes.text().then((data) => {
						// 上报fetch接口数据
					});
					// 上报fetch接口数据
					console.log("report-data:", handlerData);
					return res;
				},
				(err) => {
					const eTime = new Date().getTime();
					handlerData["extraInfo"] = {
						elapsedTime: eTime - sTime,
						status: 400,
						method,
						reqData: config && config.body,
						url,
					};
					that.collectData.add(handlerData);
					console.log("最终上报的数据:", that.collectData.get());
					// 上报fetch接口数据
					console.log("report-data:", handlerData);
					throw err;
				}
			);
		};
	}

	/**
	 * @des 3.收集click事件
	 */
	clickCollect() {
		document.addEventListener(
			"click",
			({ target }) => {
				// @ts-ignore
				const tagName = target?.tagName.toLowerCase();
				if (tagName === "body") {
					return null;
				}
				// let classNames = target.classList.value;
				// classNames = classNames !== "" ? ` class="${classNames}"` : "";
				// const id = target.id ? ` id="${target.id}"` : "";
				// const innerText = target.innerText;
				// // 获取包含id、class、innerTextde字符串的标签
				// let dom = `<${tagName}${id}${
				// 	classNames !== "" ? classNames : ""
				// }>${innerText}</${tagName}>`;
				// // 上报
				// reportData({
				// 	type: "Click",
				// 	dom,
				// });
			},
			true
		);
	}

	/**
	 * @des 收集路由事件
	 */

	util() {
		let arr: returnItemType[] = [];
		// 收集数据
		// 发送的时机
		document.addEventListener("visibilitychange", (e) => {
			let SendData = JSON.parse(JSON.stringify(arr));
			if (document.visibilityState === "hidden") {
				this.trackConfigData.trackSend({
					data: SendData,
				});
				arr = [];
			}
		});
	}
}

let test = new userEventPlugin();
// test.xhrCollect();

// async function ajax(options) {
// 	return new Promise((resolve, reject) => {
// 		const xhr = new XMLHttpRequest();
// 		const method = options.method.toUpperCase();
// 		xhr.onreadystatechange = () => {
// 			// xhr.readyState == 4 请求已完成，且响应已就绪
// 			if (xhr.readyState !== 4 || xhr.status === 0) return;
// 			const responseData = JSON.parse(xhr.response);
// 			// 当 readyState 等于 4 且status为 200 时，表示响应已就绪：
// 			if (xhr.status >= 200 && xhr.status < 300) {
// 				resolve(responseData);
// 			} else {
// 				reject(`request failed with status code ${xhr.status}`);
// 			}
// 		};
// 		if (method === "GET") {
// 			let str = "?";
// 			let param = options.data;
// 			for (let i in param) {
// 				str += str == "?" ? `${i}=${param[i]}` : `&${i}=${param[i]}`;
// 			}
// 			xhr.open(method, options.url + str, true);
// 			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
// 			xhr.send(options.data);
// 		}
// 		if (method === "POST") {
// 			xhr.open(method, options.url, true);
// 			// 经过测试，这个可以带。但是要求这个接口支持option的传参
// 			xhr.setRequestHeader("Content-type", "application/json");
// 			xhr.send(JSON.stringify(options.data));
// 		}
// 	});
// }
// let option = {
// 	method: "GET",
// 	url: "http://127.0.0.1:8088/api/get",
// 	data: { id: 5 },
// };
// ajax(option).then((e) => {
// 	console.log(e);
// });

test.fetchCollect();

fetch("http://127.0.0.1:8088/api/get", {
	body: "{ id: 5 }",
	method: "POST",
})
	.then((e) => {
		return e.json();
	})
	.then((e) => {
		console.log("ddddd:", e);
	});
