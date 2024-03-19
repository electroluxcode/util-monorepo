"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_js_1 = __importDefault(require("../base.js"));
// @ts-ignore
const index_css_inline_1 = __importDefault(require("./index.css?inline"));
class button extends base_js_1.default {
    // step1 :定义 属性 和 监听的属性
    #btnEl;
    static get observedAttributes() {
        return ["disabled"];
    }
    constructor() {
        super();
        this.adoptedStyle(index_css_inline_1.default);
        this.shadowRootInit.innerHTML = `<button
            class="button" part="button" id="button"
          >
          <slot name="container" ></slot>
          </button>
          `;
        this.#btnEl = this.shadowRootInit.getElementById("button");
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
            console.log("我点了:", this.shadowRoot.querySelector("button"));
        });
    }
    attributeChangedCallback(name, oldValue, newValue) { }
}
// 通过方法 来new出来
if (!customElements.get("wz-button")) {
    customElements.define("wz-button", button);
}
console.log("ddd");
exports.default = button;
