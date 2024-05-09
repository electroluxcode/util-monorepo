// 基础示例
interface returnItemType extends returnItemBaseType {
	type: "ErrorEvent" | "ErrorResource";
	url: any;
	extraInfo: {};
	children?: returnItemType[];
}
export class errorPlugin {
	trackConfigData;
	constructor(obj) {
		this.trackConfigData = obj;
	}
	autoRun() {
		this.util();
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
