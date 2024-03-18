let { Http } = require("../../../commonjs_build/middleware/Http/Http.js");
Http.create({
	BaseUrl: "http://localhost:8088",
	TimeOut: 10000,
	Retry: 2,
	MaxConcurrent: 1,
	BeforeRequest: (config) => {
		return config;
	},
	// 默认是json，但是自定义配置会取代掉他
	BeforeResponse: (config) => {
		return config.json();
	},
});

function compare(a, b) {
	return JSON.stringify(a) == JSON.stringify(b);
}
describe("Http", () => {
	// f1: baseurl 拼接
	test("Http/BaseConfig", () => {
		Http.request({
			url: "/api/get34",
			data: {
				id: 5656588888,
			},
			method: "GET",
			headers: {
				// "Content-Type":"application/json",
			},
		}).catch((e) => {
			let flag =
				e.config.url == "http://localhost:8088/api/get34?id=5656588888";
			expect(flag).toBe(true);
		});
		// let flag = compare(transformInstance,expectData)
	});
});
