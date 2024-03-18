import { Http } from "../Http.js";
Http.create({
	BaseUrl: "http://127.0.0.1:8098",
	// timeout 时间
	TimeOut: 3000,
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
		headers: {},
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
