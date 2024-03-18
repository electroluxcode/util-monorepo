import { Http } from "../Http.js";
/**
 * 1. get 中 header中 加上 Content-Type 也会被视为是 复杂请求触发 option 跨域
 * 2.
 * 3.
 * 4.
 */
Http.create({
	BaseUrl: "http://127.0.0.1:8098",
	TimeOut: 10000,
	Retry: 1,
	MaxConcurrent: 1,
	BeforeRequest: (config) => {
		console.log("BeforeRequest配置:", config);
		return config;
	},
	// 默认是json，但是自定义配置会取代掉他
	BeforeResponse: (config) => {
		console.log("BeforeResponse配置:", config);
		return config;
	},
});

const apiGet = () => {
	Http.request({
		url: "/api/get",
		data: {
			id: 5656588888,
		},
		method: "GET",
		headers: {
			"My-Header": 5,
			// Cookie: "ui=dark",
			// "Content-Type":"application/json",
		},
		// test:{
		//     id:5
		// },
		// credentials: "include",
		// wi
	})
		.then((e) => {
			console.log("http结果:", e);
			console.log(document.cookie);
		})
		.catch((e) => {
			console.log("e23434", e);
		});
};

apiGet();
