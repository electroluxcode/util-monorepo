///<reference path = "base.d.ts" />
/**
 * @des 错误处理 和 收集示例
 * @param object.trackSend string 插件发送的地址
 * @param object.trackConfig object object 插件的配置
 */
interface returnItemType extends returnItemBaseType {
	type: "ErrorEvent" | "ErrorResource";
	url: any;

	extraInfo: {
		// 行数
		lineno?: any;
		// 报错信息
		message?: any;
		// timeStamp 时间原点开始(聚焦开始)到创建事件的毫秒数
		timeStamp?: any;
		element?: any;
	};
	children?: returnItemType[];
}
export class errorPlugin {
	trackConfigData;
	constructor(obj) {
		this.trackConfigData = obj;
	}
	autoRun() {
		console.log("error-autoRun");
		this.util();
	}
	util() {
		let arr: returnItemType[] = [];
		window.addEventListener(
			"error",
			(e: ErrorEvent | Event) => {
				console.log("---error---:", e);
				if (e instanceof ErrorEvent) {
					arr.push({
						type: "ErrorEvent",
						url: window.location.href,
						extraInfo: {
							lineno: e.lineno,
							message: e.message,
							timeStamp: e.timeStamp,
						},
					});
				} else if (e instanceof Event) {
					// Event 需要特殊处理，这里是加载资源报错
					let target = e.target as any;
					let tagName = target.tagName;
					if (
						tagName.toUpperCase() === "IMG" ||
						tagName.toUpperCase() === "VIDEO" ||
						tagName.toUpperCase() === "SCRIPT"
					) {
						// 可以通过 target.dataset 设置重试次数
						arr.push({
							type: "ErrorResource",
							url: window.location.href,
							name: (e.target as any)?.src,
							extraInfo: {
								element: tagName,
								timeStamp: e.timeStamp,
							},
						});
						// target.src = "./error.svg";
					}
				}
			},
			true
		);

		window.addEventListener("unhandledrejection", (e) => {
			throw e.reason;
		});

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
