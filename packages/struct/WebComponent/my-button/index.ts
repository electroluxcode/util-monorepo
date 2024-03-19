import Base from "../base.js";
// @ts-ignore
import style from "./index.css?inline" assert { type: "css" };

// export default

type buttonBase = HTMLElement | any;

class button extends Base {
	// step1 :定义 属性 和 监听的属性
	#btnEl;
	static get observedAttributes() {
		return ["disabled"];
	}

	constructor() {
		super();
		this.adoptedStyle(style);

		this.shadowRootInit.innerHTML = `<button
            class="button" part="button" id="button"
          >
          <slot name="container" ></slot>
		  <slot  ></slot>
          </button>
          `;

		this.#btnEl = this.shadowRootInit.getElementById("button")! as buttonBase;
	}

	get size() {
		return this.getAttribute("size") || "";
	}
	set size(value) {
		this.setAttribute("size", value);
	}

	connectedCallback() {
		let that = this;
		this.addEventListener("click", function () {
			console.log("我点了:", this.shadowRoot!.querySelector("button"));
		});
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {}
}

// 通过方法 来new出来
if (!customElements.get("my-button")) {
	customElements.define("my-button", button);
}

export default button;
