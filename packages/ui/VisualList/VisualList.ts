class DataProxy {
	Data: any;
	ProxyFn: Array<Function>;
	[key: string]: any;
	constructor(Data: any) {
		this.Data = Data;
		this.ProxyFn = [];
	}
	ProxyGet() {
		let that = this;
		let ProxyRenderData = new Proxy(this.Data, {
			get: function (target, key) {
				if (key in target) {
					return target[key];
				}
			},
			set: function (target, key, value) {
				// console.log("触发set", target, key, value)
				target[key] = value;

				if (that.ProxyFn) {
					Promise.OrderAll(that.ProxyFn, that.ProxyGet()).then((e: any) => {
						// console.log("promise代理的结果:", e)
					});
				}
				return true;
			},
		});
		return ProxyRenderData;
	}
	FnAdd(param: any) {
		// 判断是不是promise
		// if(typeof param.then==="function"){
		//     this.ProxyFn.push(param)
		//     return
		// }
		let temp = param.bind(this.ProxyGet());
		this.ProxyFn.push(temp);
	}
}

// @ts-nocheck
interface PromiseConstructor {
	OrderAll: any;
}

(Promise as unknown as PromiseConstructor).OrderAll = function (
	promiseArray: Array<Promise<any>>,
	that: any
) {
	const arr: Array<any> = [];
	return new Promise(async (resolve) => {
		for (let index = 0; index < promiseArray.length; index++) {
			console.log("that:", that);
			let promiseItem = (promiseArray[index] as any).bind(that);
			let res = await promiseItem();
			arr.push(res);
		}
		resolve(arr);
	});
};

/**
 * @des 检查 是不是 relative、absolute、fixed,不是就报错
 * @param this
 */
function CheckLayout(this: viType) {
	// if(getComputedStyle(this.container).position!="relative"){
	//     throw new Error("根组件布局有问题")
	// }
}

interface viType {
	container: HTMLElement;
}

interface VisualListType {
	data: any;
	// 单个列表的父元素dom
	ParentElement: any;
	// 单个列表的子元素dom
	ChildrenElement: any;
	// 可视区的 dom
	ViewElement: any;
}
/**
 * @des 需要维护两个数组 第一个数组是初始数组，第二个数组是渲染数组
 */
class VisualList {
	ViewObject: {
		// 单个渲染元素 | 计算高度
		SingleElement?: string;
		// 单个元素高度
		SingleElementHeight: number;
		// 可视区高度(传参)
		ViewElement?: any;
		ViewElementHeight?: any;
		// 可视区展示的元素数量
		ViewElementCount: number;
		BeforeElementCount?: number;
		BeforeElementHeight?: any;
		// 父元素dom(传参)
		ParentElement: HTMLDivElement;
		// 单个列表的子元素dom
		ChildrenElement?: any;
	};
	// 代理数据
	TrueRenderData?: {
		init: {
			status: "create" | "update";
			data: any;
			start: any;
		};
	};
	constructor(param: VisualListType) {
		console.log(this);

		// 初始化传参
		this.ViewObject = {} as any;
		this.ViewObject.ParentElement = param.ParentElement;
		this.ViewObject.ViewElement = param.ViewElement;
		this.ViewObject.ChildrenElement = param.ChildrenElement;
		this.TrueRenderData = this.ProxyGet({
			init: {
				status: "create",
				data: param.data,
			},
		});
		this.FirstRender(this.TrueRenderData);
		// 初始化监听事件
		this.ViewObject.ViewElement.addEventListener("scroll", () => {
			// 尽量包括多一点东西
			let BeforeElementCount = Math.floor(
				this.ViewObject.ViewElement.scrollTop /
					this.ViewObject.SingleElementHeight
			);
			console.log(
				"????",
				BeforeElementCount,
				BeforeElementCount + this.ViewObject.ViewElementCount + 1
			);
			this.TrueRenderData!.init = {
				data: param.data.slice(
					BeforeElementCount,
					BeforeElementCount + this.ViewObject.ViewElementCount + 1
				),
				status: "update",
				start: BeforeElementCount,
			};

			console.log({
				data: param.data.slice(
					BeforeElementCount,
					BeforeElementCount + this.ViewObject.ViewElementCount + 1
				),
				status: "update",
				start: BeforeElementCount,
			});
		});
	}
	ProxyGet(TrueRenderData: any) {
		let ProxyRender = new DataProxy(TrueRenderData);
		let ProxyRenderData = ProxyRender.ProxyGet();
		let that = this;
		ProxyRender.FnAdd(function () {
			console.log("this:", this.init.data, this.init.start);
			if (this.init.status == "update") {
				that.ReRender(
					document.querySelector(".container_layer"),
					this.init.data,
					this.init.start,
					false
				);
			}
		});
		return ProxyRenderData;
	}

	/**
	 * @des 用来双向绑定的
	 * @param ui
	 * @param data
	 * @param start
	 * @first 是不是第一次渲染
	 */
	ReRender(ui: any, data: any, start: any, first: boolean) {
		if (first) {
			for (let i = 0; i < this.ViewObject.ViewElementCount; i++) {
				// console.log(data["data"][i])
				let text = document.createElement("p");
				text.innerHTML = data[i].id;
				text.style.top = `${i * this.ViewObject.SingleElementHeight}px`;
				this.ViewObject.ParentElement.appendChild(text);
			}

			return;
		}
		let length = ui.children.length;
		// console.log("data:",data["data"][0].id)
		for (let i = 0; i < length; i++) {
			// console.log(data["data"][i])
			let temp = data[i].id;
			ui.children[i].style.top = `${
				(i + start) * this.ViewObject.SingleElementHeight
			}px`;
			ui.children[i].innerHTML = temp;
			// debugger;
		}
	}

	FirstRender(data: any) {
		// 单个组件高度
		this.ViewObject.ParentElement.innerHTML = this.ViewObject?.ChildrenElement;
		this.ViewObject.SingleElementHeight =
			this.ViewObject.ParentElement.children[0].getBoundingClientRect().height;
		this.ViewObject.ParentElement.innerHTML = ``;

		// 可视区初始化(需要计算的)
		this.ViewObject.ViewElementHeight =
			this.ViewObject.ViewElement.clientHeight;
		this.ViewObject.BeforeElementCount = 0;
		this.ViewObject.BeforeElementHeight = 0;

		this.ViewObject.ViewElementCount = Math.ceil(
			this.ViewObject.ViewElementHeight / this.ViewObject.SingleElementHeight
		);
		let AllRenderElementHeight =
			this.TrueRenderData?.init.data.length *
			this.ViewObject.SingleElementHeight;
		this.ViewObject.ParentElement.style.height = `${AllRenderElementHeight}px`;

		// 渲染ui

		let start = 0;
		let ViewElementCount = this.ViewObject.ViewElementCount;
		this.ReRender(
			document.querySelector(".container_layer"),
			this.TrueRenderData?.init.data.slice(0, ViewElementCount),
			0,
			true
		);
		let temp: any = [];
		// children[0].clientHeight
		for (let i = start; i <= ViewElementCount; i++) {
			temp.push(data[i]);
			console.log(this.ViewObject.ParentElement.children[i], "????");
			// this.ViewObject.ParentElement.children[i].style.top = `${i * this.ViewObject.SingleElementHeight}px`

			if (i == ViewElementCount) {
				console.log("触发");
				this.TrueRenderData!.init = {
					data: temp,
					status: "create",
					start: 0,
				};
			}
		}
	}
}

// vi.call({
//     container:document.querySelector(".container")!  as HTMLElement
// });

let data = [
	{ id: 0 },
	{ id: 1 },
	{ id: 2 },
	{ id: 3 },
	{ id: 4 },
	{ id: 5 },
	{ id: 6 },
	{ id: 7 },
	{ id: 8 },
	{ id: 9 },
	{ id: 10 },
	{ id: 11 },
	{ id: 12 },
	{ id: 13 },
	{ id: 14 },
	{ id: 15 },
	{ id: 16 },
	{ id: 17 },
	{ id: 18 },
	{ id: 19 },
	{ id: 20 },
	{ id: 21 },
	{ id: 22 },
	{ id: 23 },
	{ id: 24 },
	{ id: 25 },
	{ id: 26 },
	{ id: 27 },
	{ id: 28 },
	{ id: 29 },
	{ id: 30 },
	{ id: 31 },
	{ id: 32 },
	{ id: 33 },
	{ id: 34 },
	{ id: 35 },
	{ id: 36 },
	{ id: 37 },
	{ id: 38 },
	{ id: 39 },
	{ id: 40 },
	{ id: 41 },
	{ id: 42 },
	{ id: 43 },
	{ id: 44 },
	{ id: 45 },
	{ id: 46 },
	{ id: 47 },
	{ id: 48 },
	{ id: 49 },
	{ id: 50 },
	{ id: 51 },
	{ id: 52 },
	{ id: 53 },
	{ id: 54 },
	{ id: 55 },
	{ id: 56 },
	{ id: 57 },
	{ id: 58 },
	{ id: 59 },
	{ id: 60 },
	{ id: 61 },
	{ id: 62 },
	{ id: 63 },
	{ id: 64 },
	{ id: 65 },
	{ id: 66 },
	{ id: 67 },
	{ id: 68 },
	{ id: 69 },
	{ id: 70 },
	{ id: 71 },
	{ id: 72 },
	{ id: 73 },
	{ id: 74 },
	{ id: 75 },
	{ id: 76 },
	{ id: 77 },
	{ id: 78 },
	{ id: 79 },
	{ id: 80 },
	{ id: 81 },
	{ id: 82 },
	{ id: 83 },
	{ id: 84 },
	{ id: 85 },
	{ id: 86 },
	{ id: 87 },
	{ id: 88 },
	{ id: 89 },
	{ id: 90 },
	{ id: 91 },
	{ id: 92 },
	{ id: 93 },
	{ id: 94 },
	{ id: 95 },
	{ id: 96 },
	{ id: 97 },
	{ id: 98 },
	{ id: 99 },
	{ id: 100 },
	{ id: 101 },
	{ id: 102 },
	{ id: 103 },
	{ id: 104 },
	{ id: 105 },
	{ id: 106 },
	{ id: 107 },
	{ id: 108 },
	{ id: 109 },
	{ id: 110 },
	{ id: 111 },
	{ id: 112 },
	{ id: 113 },
	{ id: 114 },
	{ id: 115 },
	{ id: 116 },
	{ id: 117 },
	{ id: 118 },
	{ id: 119 },
	{ id: 120 },
	{ id: 121 },
	{ id: 122 },
	{ id: 123 },
	{ id: 124 },
	{ id: 125 },
	{ id: 126 },
	{ id: 127 },
	{ id: 128 },
	{ id: 129 },
	{ id: 130 },
	{ id: 131 },
	{ id: 132 },
	{ id: 133 },
	{ id: 134 },
	{ id: 135 },
	{ id: 136 },
	{ id: 137 },
	{ id: 138 },
	{ id: 139 },
	{ id: 140 },
	{ id: 141 },
	{ id: 142 },
	{ id: 143 },
	{ id: 144 },
	{ id: 145 },
	{ id: 146 },
	{ id: 147 },
	{ id: 148 },
	{ id: 149 },
	{ id: 150 },
	{ id: 151 },
	{ id: 152 },
	{ id: 153 },
	{ id: 154 },
	{ id: 155 },
	{ id: 156 },
	{ id: 157 },
	{ id: 158 },
	{ id: 159 },
	{ id: 160 },
	{ id: 161 },
	{ id: 162 },
	{ id: 163 },
	{ id: 164 },
	{ id: 165 },
	{ id: 166 },
	{ id: 167 },
	{ id: 168 },
	{ id: 169 },
	{ id: 170 },
	{ id: 171 },
	{ id: 172 },
	{ id: 173 },
	{ id: 174 },
	{ id: 175 },
	{ id: 176 },
	{ id: 177 },
	{ id: 178 },
	{ id: 179 },
	{ id: 180 },
	{ id: 181 },
	{ id: 182 },
	{ id: 183 },
	{ id: 184 },
	{ id: 185 },
	{ id: 186 },
	{ id: 187 },
	{ id: 188 },
	{ id: 189 },
	{ id: 190 },
	{ id: 191 },
	{ id: 192 },
	{ id: 193 },
	{ id: 194 },
	{ id: 195 },
	{ id: 196 },
	{ id: 197 },
	{ id: 198 },
	{ id: 199 },
	{ id: 195 },
	{ id: 196 },
	{ id: 197 },
	{ id: 198 },
	{ id: 199 },
	{ id: 195 },
	{ id: 196 },
	{ id: 197 },
	{ id: 198 },
	{ id: 199 },
];
interface VisualListType {
	data: any;
	// 单个列表的父元素dom
	ParentElement: any;
	// 单个列表的子元素dom
	ChildrenElement: any;
	// 可视区的 dom
	ViewElement: any;
}

new VisualList({
	data,
	ParentElement: document.querySelector(".container_layer"),
	ChildrenElement: "<p>22</p>",
	ViewElement: document.querySelector(".container"),
});
