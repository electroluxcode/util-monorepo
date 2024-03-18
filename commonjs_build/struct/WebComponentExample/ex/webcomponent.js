"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// removeNode(button);
// @ts-ignore
const normal_css_1 = __importDefault(require("../css/normal.css"));
class myDiv extends HTMLElement {
    // 监听
    static get observedAttributes() {
        return ["option", "name"];
    }
    constructor() {
        super();
        this.shadowRoot;
        // 这样我们才能够去追加元素
        this.attachShadow({ mode: "open" });
    }
    // 重要：生命周期方法 开始
    connectedCallback() {
        console.log("connectedCallback生命周期");
    }
    attributeChangedCallback(attr, oldValue, newValue) { }
    render() {
        let nodeTemplate = document.createElement("template");
        nodeTemplate.innerHTML = `
            <div class="content" >
                <div class="title">组件 </div> 
                <slot name="container"></slot>
            </div>
        `;
        this.shadowRoot.appendChild(nodeTemplate.content);
        this.shadowRoot.adoptedStyleSheets = [normal_css_1.default];
    }
}
// 名字必须小写 必须有横线
customElements.define("my-div", myDiv);
