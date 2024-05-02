import { dataEnchance } from "./data.js";
// 这里可以设置插入的元素,第三层  p h1 h2 等都可以
let thirdElement = "div.testt";

// 这里设置第二层
let secondElement = ".inner";

// 这里设置顶层
let firstElement = ".container";

class DataProxy {
	Data;
	ProxyFn;
	constructor(Data) {
		this.Data = Data;
		this.ProxyFn = [];
	}
	ProxyGet() {
		let that = this;
		this.Data.value = this.Data;
		let ProxyRenderData = new Proxy(this.Data.value, {
			get: function (target, key) {
				if (key in target) {
					return target[key];
				}
			},
			set: function (target, key, value) {
				// console.log("触发set", target, key, value)
				target[key] = value;
				if (key == "length") {
				} else {
					// console.log("触发set方法:", key, value, target);
					let container = document.querySelector(secondElement);
					container!.innerHTML = "";
					target.value.forEach((element) => {
						let ele = thirdElement.split(".");
						let p = document.createElement(ele[0]);
						p.setAttribute("class", ele[1]);
						p.innerHTML = element.id;
						p.addEventListener("click", () => {
							console.log("click-event:", element.id);
						});
						container?.appendChild(p);
					});
				}

				return true;
			},
		});
		return ProxyRenderData;
	}
}

interface VisualListDataType {
	mode: "event";
	render: (...arg: any) => void;
	// 单个列表的父元素dom
	ParentElement: any;
	// 单个列表的子元素dom
	ChildrenElement: any;
	// 可视区的 dom
	ViewElement: any;
	data: any;
}
type VisualListType = VisualListDataType;

let debounce = (fn: Function, timer: number) => {
	let flag: any;
	return function (args: any) {
		if (flag) {
			clearTimeout(flag);
		}
		flag = setTimeout(() => {
			fn(args);
		}, timer);
	};
};

/**
 * @des 数据源交给代理 需要维护两个数组 第一个数组是初始数组，第二个数组是渲染数组
 * @des 基本dom结构需要三层 第一层是可视区(爷爷)，第二层基本不需要定义(父亲),第三层是我们的虚拟列表
 */
class VisualList {
	initData;
	ViewObject: {};
	startIndex = 0;
	endIndex = 1;
	nowCount;
	// 代理数据
	constructor(param: VisualListType) {
		this.initData = param;
		if (param.mode == "event") {
			this.eventMode(param);
		}
	}
	sleep(time) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve("");
			}, time);
		});
	}
	/**
	 * @des 需要使用者绑定一个render方法
	 * @des 注意使用者需要在render方法中进行可视区数据的绑定
	 * @param param
	 */
	async eventMode(param: VisualListType) {
		// 初始渲染一个
		this.render(param, 0, 1);

		let ViewElement = document.querySelector(param.ViewElement);
		let parentElement = document.querySelector(secondElement) as any;
		// 加上offset
		let offset = 30;
		let beforeHeight = 0;
		let beforeScrollTop;
		let beforeScrollArr: any = [];
		let beforeTime = new Date().getTime();

		ViewElement.addEventListener("scroll", async () => {
			let ChildrenElement = ViewElement.children[0];
			let secondElementContainer = document.querySelector(secondElement) as any;
			let scrollTop = ViewElement.scrollTop;
			let isUpDirction = beforeScrollTop > scrollTop ? true : false;
			ViewElement.children[0].style.position = "relative";
			ViewElement.children[0].style.top = scrollTop + "px";
			beforeScrollTop = scrollTop;
			if (!isUpDirction && scrollTop > beforeHeight) {
				for (let i = 0; i < secondElementContainer?.children.length; i++) {
					// 如果累计的高度大于的话，那么start会变化
					if (scrollTop >= beforeHeight) {
						if (new Date().getTime() - beforeTime > 23) {
							beforeTime = new Date().getTime();
						} else {
							continue;
						}
						beforeHeight += secondElementContainer.children[i]?.offsetHeight;
						beforeScrollArr.push(
							secondElementContainer.children[i]?.offsetHeight
						);
						this.startIndex++;
						param.render(param.data.slice(this.startIndex, this.endIndex));
						while (
							ViewElement.offsetHeight + offset >=
							parentElement.offsetHeight
						) {
							this.endIndex++;
							param.render(param.data.slice(this.startIndex, this.endIndex));
						}
					}
				}
			}

			// && scrollTop - beforeScrollArr.at(-1) > beforeHeight
			if (scrollTop < beforeHeight && isUpDirction) {
				let base = 0;
				let diff = beforeHeight - scrollTop;
				for (let i = 0; i < beforeScrollArr.length; i++) {
					base = base + beforeScrollArr[i];
					console.log("base:", { base, beforeHeight, scrollTop, diff });

					if (base > diff) {
						beforeHeight = scrollTop - beforeScrollArr[i];
						let nowCount;
						let tempHeight = 0;
						for (let j = i; j < beforeScrollArr.length; j++) {
							if (
								document.querySelector(param.ParentElement).offsetHeight >
								tempHeight
							) {
								tempHeight += beforeScrollArr[j];
								nowCount = j - i;
							} else {
								break;
							}
						}
						console.log("nowCount:", nowCount);
						beforeScrollArr.pop();
						this.startIndex = i;
						console.log("开始的start", this.startIndex);
						scrollTop = beforeHeight;
						this.render(
							param,
							this.startIndex,
							this.startIndex + 2,
							beforeHeight
						);
						break;
					} else {
						continue;
					}
				}
			}
			// for(let i in )
		});
	}

	async render(param, index, endindex, beforeHeight?: number) {
		this.startIndex = index;
		this.endIndex = endindex;
		console.log("render:", index, endindex, param);

		param.render([param.data[index]]);
		let ViewElement = document.querySelector(param.ViewElement);

		let parentElement = document.querySelector(secondElement) as any;

		let setTop = this.debounce((beforeHeight) => {
			console.log("settop:", beforeHeight);
			ViewElement.children[0].style.position = "relative";
			ViewElement.children[0].style.top = beforeHeight + "px";
			document.querySelector(param.ViewElement).scrollTop = beforeHeight;
		}, 100);
		// 加上offset
		let offset = 30;
		while (ViewElement.offsetHeight + offset >= parentElement.offsetHeight) {
			await this.sleep(1);
			this.endIndex++;
			console.log(
				"this.startIndex, this.endIndex:",
				this.startIndex,
				this.endIndex
			);
			param.render(param.data.slice(this.startIndex, this.endIndex));
			if (beforeHeight) {
				console.log("param.ViewElement:", param.ViewElement);
				setTop(beforeHeight);
			}
		}
	}
	debounce(fnc, delay = 3000) {
		var timer: any = null; // 创建一个用来存放定时器的变量
		return function (arg) {
			clearTimeout(timer); //只要触发就清除
			timer = setTimeout(() => {
				fnc.apply(this, arguments);
			}, delay);
		};
	}
}

let test = new DataProxy([]);
let case1 = test.ProxyGet();
new VisualList({
	ParentElement: secondElement,
	ChildrenElement: thirdElement,
	ViewElement: firstElement,
	data: dataEnchance,
	mode: "event",
	render: (data) => {
		// console.log("render:", data);
		case1.value = data;
	},
});
