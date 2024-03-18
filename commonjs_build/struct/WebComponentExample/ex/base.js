"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { theme } from "./enhance/theme.js";
// let life_case = new life();
// life_case.register("run", theme);
// export default class Base extends HTMLElement {
// 	shadowRootInit: any | HTMLDivElement;
// 	// this.slots : Object
// 	constructor() {
// 		super();
// 		this.shadowRootInit = this.attachShadow({ mode: "open" });
// 		// this.theme()
// 		// let enhanceMount = throle(, 100)
// 		// enhanceMount()
// 		this.mount();
// 		// this.mount()
// 	}
// 	/**
// 	 * @des 注册全局事件
// 	 */
// 	async mount() {
// 		// console.log("开始挂载")
// 		const undefinedElements = document.querySelectorAll(":not(:defined)");
// 		const promises = [...undefinedElements].map((button) => {
// 			return customElements.whenDefined(button.localName);
// 		});
// 		let res = await Promise.all(promises);
// 		//  挂载完成后的事情
// 		life_case.call("run", this);
// 		//  挂载后全局注册主题色
// 		this.adoptedStyle(styles);
// 	}
// 	/**
// 	 * @des e 没有传参 就是 初始化，传参就是切换
// 	 * @param e
// 	 */
// 	/**
// 	 * @des 深色浅色模式切换
// 	 * @param e
// 	 */
// 	mode(e: themeType) {
// 		if (this.shadowRootInit.children.length > 1) {
// 			throw new Error("根元素不能超过1个");
// 		}
// 		if (e.mode == "light") {
// 			this.shadowRootInit.children[0].classList.remove("dark");
// 		} else {
// 			this.shadowRootInit.children[0].classList.add("dark");
// 		}
// 		// console.log("出现吧", eventbus.eventBus, e)
// 	}
// 	adoptedStyle(style: CSSStyleSheet) {
// 		let styleSheet = style;
// 		if (!style.type) {
// 			// vite会把style编译成成字符串
// 			styleSheet = new CSSStyleSheet();
// 			//@ts-ignore
// 			styleSheet.replace(style);
// 		}
// 		this.shadowRoot!.adoptedStyleSheets = [
// 			...this.shadowRoot!.adoptedStyleSheets,
// 			styleSheet,
// 		];
// 	}
// 	get name() {
// 		return this.getAttribute("name")!;
// 	}
// 	set name(value: string) {
// 		this.setAttribute("name", value);
// 		return;
// 	}
// 	get attr() {
// 		const attrs = ["type", "class"];
// 		return [...this.attributes]
// 			.filter((el) => !el.name.startsWith("on") && !attrs.includes(el.name))
// 			.map((e) => e.name + "='" + (e.value || "true") + "'")
// 			.join(" ");
// 	}
// }
