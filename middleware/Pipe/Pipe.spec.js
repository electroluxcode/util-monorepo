let {
	Pipe,
	PipeAsync,
} = require("../../commonjs_build/middleware/Pipe/Pipe.js");

describe("Pipe", () => {
	// f1: 测试Pipe 基础功能
	test("Pipe/base", async () => {
		let addC = (param) => {
			return param + 10;
		};
		let plusC = (param) => {
			return param + 10;
		};
		let pipeCFn = Pipe(addC, plusC);
		expect(20).toBe(pipeCFn(0));
	});

	// f2: 测试异步 和 赋值逻辑
	test("Pipe/async", () => {
		return new Promise((resolve) => {
			
			let sleep = (param) => {
				return new Promise((resolve) => {
					setTimeout(
						(param) => {
							resolve(param);
						},
						100,
						param
					);
				});
			};
			let add = async (param) => {
				let data = await sleep(param);
				return data + 20;
			};
			let plus = async (param) => {
				let data = await sleep(param);
				return data + 20;
			};
			let pipeFn = PipeAsync(add, plus);
			let d = pipeFn(0);
			d.then((e) => {
				resolve()
                expect(40).toBe(e);
			});
			
		});
	});
});
