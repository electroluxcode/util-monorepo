let { Pool } = require("../../../commonjs_build/middleware/Pool/Pool.js");

let sleepFn = (e, rejectBoolean = false) => {
	return new Promise((resolve, reject) => {
		setTimeout(
			(e) => {
				if (rejectBoolean) {
					reject(e);
				}
				resolve(e);
			},
			e,
			e
		);
	});
};

describe("Pool", () => {
	let temp = {
		eventBus: {
			finish: [() => {}],
		},
		// 最大重试次数
		MaxRetryCount: 1,
		// 最大并发数
		MaxConcurrentCount: 2,
		// 异步数组
		PromiseArr: [
			async () => {
				return sleepFn(0);
			},
		],
		// 参数列表数组
	};
	// f1: 测试事件
	test("Pool/event", async () => {
		expect.assertions(1);
		return new Promise((resolve) => {
			temp = {
				eventBus: {
					finish: [
						(e) => {
							resolve();
							expect(e).toBe("utilmonorepo默认提示:并发池完成");
						},
					],
				},
				// 最大重试次数
				MaxRetryCount: 1,
				// 最大并发数
				MaxConcurrentCount: 2,
				// 异步数组
				PromiseArr: [
					async () => {
						return sleepFn(0);
					},
				],
				// 参数列表数组
			};
			res = new Pool(temp);
		});
	});

	// f2 测试并发
	test("Pool/Concurrent", async () => {
		expect.assertions(1);
		return new Promise((resolve) => {
			temp = {
				eventBus: {
					finish: [(e) => {}],
				},
				// 最大重试次数
				MaxRetryCount: 1,
				// 最大并发数
				MaxConcurrentCount: 1,
				// 异步数组
				PromiseArr: [
					async () => {
						return sleepFn(0);
					},
					() => {
						return sleepFn(0);
					},
				],
				ConcurrentFn: () => {
					resolve();
					expect(true).toBe(true);
				},
			};
			res = new Pool(temp);
		});
	});
	// f3:测试错误重试
	test("Pool/Retry", async () => {
		expect.assertions(1);
		return new Promise((resolve) => {
			temp = {
				eventBus: {
					finish: [(e) => {}],
				},
				// 最大重试次数
				MaxRetryCount: 2,
				// 最大并发数
				MaxConcurrentCount: 1,
				// 异步数组
				PromiseArr: [
					async () => {
						return sleepFn(0, true);
					},
					() => {
						return sleepFn(0);
					},
				],
				ConcurrentFn: () => {},
				RetryFn: () => {
					resolve();
					expect(true).toBe(true);
				},
			};

			res = new Pool(temp);
		});
	});
	// f3: 测试异步 和 赋值逻辑
});
