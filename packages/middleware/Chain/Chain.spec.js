let { Chain } = require("../../../commonjs_build/middleware/Chain/Chain.js");

function compare(a, b) {
	return JSON.stringify(a) == JSON.stringify(b);
}

const sleep = () => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ code: "成功" });
		}, 1000);
	});
};

function FirstStep() {
	if (!this.ChainData.init !== "error") {
		this.emit("error", "使用者触发error事件");
		return;
	}
	return "ChainNext";
}
async function FirstAsyncStep() {
	let that = this;
	this.ChainData.id = "async数据";
	sleep().then((e) => {
		that.asyncNext();
	});
}
function SecondStep() {
	this.emit("finish", "结束");
	return "ChainNext";
}

describe("Chain", () => {
	// f1: 测试error事件
	test("Chain/error", async () => {
		expect.assertions(1);
		return new Promise((resolve) => {
			const ChainFirstStep = new Chain(FirstStep);
			const ChainSecondStep = new Chain(SecondStep);
			ChainFirstStep.nodeSet(ChainSecondStep);
			ChainFirstStep.dataSet({
				init: "helloworld",
				eventBus: {
					error: [
						(e) => {
							setTimeout(() => {
								resolve();
								expect(e).toBe("使用者触发error事件");
							}, 10);
						},
					],
					finish: [() => {}],
				},
			});
			ChainFirstStep.passRequest();
		});
	});

	// f2: 测试异步 和 赋值逻辑
	test("Chain/value/async", async () => {
		expect.assertions(1);
		return new Promise((resolve) => {
			const ChainFirstStep = new Chain(FirstAsyncStep);
			const ChainSecondStep = new Chain(SecondStep);
			ChainFirstStep.nodeSet(ChainSecondStep);
			ChainFirstStep.dataSet({
				init: "helloworld",
				eventBus: {
					finish: [
						() => {
							resolve();
							expect(ChainFirstStep.ChainData.id).toBe("async数据");
						},
					],
				},
			});
			ChainFirstStep.passRequest();
		});
	});
});
