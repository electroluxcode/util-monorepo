///<reference path = "base.d.ts" />
interface returnItemType extends returnItemBaseType {
	type: "userEvent";
	// 请求 url
	url: any;
	extraInfo: {
		// 请求方式
		method?: string;
		type?: "xhr" | "fetch";
		startTime?: any;
		reqData?: any;
		status?: any;
		// 接口请求总时长
		elapsedTime?: any;
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

			message[urlKey]["extraInfo"]["type"] = "xhr";

			message[urlKey]["extraInfo"]["startTime"] = new Date().getTime();

			message[urlKey]["extraInfo"]["method"] =
				typeof args[0] === "string" ? args[0].toUpperCase() : args[0];

			message[urlKey]["extraInfo"]["url"] = urlKey;

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
test.xhrCollect();

async function ajax(options) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		const method = options.method.toUpperCase();
		xhr.onreadystatechange = () => {
			// xhr.readyState == 4 请求已完成，且响应已就绪
			if (xhr.readyState !== 4 || xhr.status === 0) return;
			const responseData = JSON.parse(xhr.response);
			// 当 readyState 等于 4 且status为 200 时，表示响应已就绪：
			if (xhr.status >= 200 && xhr.status < 300) {
				resolve(responseData);
			} else {
				reject(`request failed with status code ${xhr.status}`);
			}
		};
		if (method === "GET") {
			let str = "?";
			let param = options.data;
			for (let i in param) {
				str += str == "?" ? `${i}=${param[i]}` : `&${i}=${param[i]}`;
			}
			xhr.open(method, options.url + str, true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send(options.data);
		}
		if (method === "POST") {
			xhr.open(method, options.url, true);
			// 经过测试，这个可以带。但是要求这个接口支持option的传参
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.send(JSON.stringify(options.data));
		}
	});
}
let option = {
	method: "GET",
	url: "http://127.0.0.1:8088/api/get",
	data: { id: 5 },
};
ajax(option).then((e) => {
	console.log(e);
});
