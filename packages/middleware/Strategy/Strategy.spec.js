let {
	Strategy,
} = require("../../../commonjs_build/middleware/Strategy/Strategy.js");

let res;
describe("Strategy", () => {
	// f1: 错误+基础事件触发
	test("Strategy/error+event", () => {
		let Age20_SchoolA_RegionCN = { age: 20, school: "A", region: "cn" };

		res = new Strategy({
			eventBus: {
				default: [
					(e) => {
						// console.log("触发默认方法:", e)
					},
				],
				error: [
					(e) => {
						expect(e).toBe("utilmonorepo默认提示:报错示例");
						console.log("触发报错:", e);
					},
				],
			},
		});
		res.ActionAdd(Age20_SchoolA_RegionCN, function (workHours) {
			throw new Error("报错");
		});
	});

	// f2 测试 object 基本 key value 不同
	test("Strategy/sortkey", () => {
		let Age20_SchoolA_RegionCN = { school: "A", region: "cn", age: 20 };

		res = new Strategy({
			eventBus: {
				default: [
					(e) => {
						// console.log("触发默认方法:", e)
					},
				],
				error: [(e) => {}],
			},
		});
		res.ActionAdd(Age20_SchoolA_RegionCN, function () {
			expect(true).toBe(true);
		});
	});

	// f3 测试 自定义事件
	test("Strategy/userevent", () => {
		let Age20_SchoolA_RegionCN = { school: "A", region: "cn", age: 20 };

		res = new Strategy({
			eventBus: {
				my: [
					(e) => {
						expect(true).toBe(true);
					},
				],
				error: [(e) => {}],
			},
		});
		res.ActionAdd(Age20_SchoolA_RegionCN, function () {
			this.emit("my");
		});
	});
});
