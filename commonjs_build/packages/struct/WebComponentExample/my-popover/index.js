"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_js_1 = __importDefault(require("../base.js"));
// @ts-ignore
const B_css_inline_1 = __importDefault(require("./B.css?inline"));
// @ts-ignore
const L_css_inline_1 = __importDefault(require("./L.css?inline"));
// @ts-ignore
const R_css_inline_1 = __importDefault(require("./R.css?inline"));
// @ts-ignore
const T_css_inline_1 = __importDefault(require("./T.css?inline"));
class button extends base_js_1.default {
    // step1 :定义 属性 和 监听的属性
    #btnEl;
    static get observedAttributes() {
        return ["disabled"];
    }
    constructor() {
        super();
        this.adoptedStyle(B_css_inline_1.default);
        this.adoptedStyle(L_css_inline_1.default);
        this.adoptedStyle(R_css_inline_1.default);
        this.adoptedStyle(T_css_inline_1.default);
        this.shadowRootInit.innerHTML = ` <div id="pop" class="pop" dir="R" part="pop" contextmenu>
		<div>
			dsasd
		</div>
		<div>23</div>
	</div>
          `;
        let pop = document.querySelector("#pop");
        // 需要被触发的元素
        let target = document.querySelector(".target");
        let _documentClickEvent = [];
        let node = document.querySelector(".pop").innerHTML;
        let isHover;
        let timer;
        let targetList;
        let open;
        let isHoverPoper;
        // ----   底层  -------
        function setPosition() {
            const { left, top, right, bottom, width } = target.getBoundingClientRect();
            // console.log("重新计算:",{ left, top, right, bottom, width })
            pop.style.setProperty("--left", left + window.pageXOffset);
            pop.style.setProperty("--top", top + window.pageYOffset);
            pop.style.setProperty("--right", right + window.pageXOffset);
            pop.style.setProperty("--bottom", bottom + window.pageYOffset);
            pop.style.setProperty("--width", width);
        }
        function init(target, option = {
            dir: "",
            trigger: "hover,focus",
        }) {
            if (!target)
                return;
            if (!target.clientWidth)
                return;
            pop.target = target;
            if (option.dir.includes(",")) {
                // 这样子赋值可以直接赋值给element里面的属性
                pop.auto = option.dir;
                // pop.dir = option.dir.split(",")[0];
            }
            // hover
            if (option.trigger.includes("hover")) {
                target.addEventListener("mouseenter", () => {
                    if (open)
                        return;
                    // console.log("target mouseenter触发")
                    isHover = true;
                    timer && clearTimeout(timer);
                    timer = setTimeout(() => {
                        render();
                        pop.target = target;
                        open = true;
                        pop.setAttribute("open", true);
                        pop.setAttribute("show", true);
                        setPosition();
                    }, 200);
                });
                target.addEventListener("mouseleave", (ev) => {
                    // 是否处于hover
                    setTimeout(() => {
                        // console.log("target mouseleave触发")
                        if (isHover && !isHoverPoper) {
                            isHover = false;
                            open = false;
                            pop.removeAttribute("open");
                            pop.removeAttribute("show");
                            setPosition();
                        }
                        timer && clearTimeout(timer);
                    }, 100);
                });
                // pop专注于修改位置 和 设置变量
                pop.addEventListener("mouseenter", () => {
                    if (isHover) {
                        isHoverPoper = true;
                        open = true;
                        setPosition();
                    }
                });
                pop.addEventListener("mouseleave", (ev) => {
                    if (isHoverPoper) {
                        isHoverPoper = false;
                        open = false;
                        setPosition();
                        pop.removeAttribute("open");
                        pop.removeAttribute("show");
                    }
                });
            }
        }
        // ----   调用  -------
        // 触发的位置可以在 里面 也可以在顶层的上面
        function targetAll() {
            return [pop.previousElementSibling || pop.parentNode];
        }
        function render() {
            targetList = targetAll();
            targetList.forEach((target) => {
                if (!target.clientWidth)
                    return;
                if (pop.hasAttribute("contextmenu")) {
                    target.addEventListener("contextmenu", (ev) => {
                        ev.preventDefault();
                        // pop.style.setProperty("--left",ev.pageX)
                        // pop.style.setProperty("--top",ev.pageY)
                        // document.body.append(this);
                        pop.style.left = ev.pageX + "px";
                        pop.style.top = ev.pageY + "px";
                        // 二次点击
                        open = true;
                        pop.style.visibility = "";
                        pop.style.opacity = "1";
                        if (_documentClickEvent.length)
                            return;
                        const click = (ev) => {
                            const { left, top, right, bottom } = target.getBoundingClientRect();
                            if (ev.x > right || ev.y > bottom || ev.x < left || ev.y < top) {
                                console.log("out");
                                open = false;
                                isHover = false;
                                pop.removeAttribute("open");
                                pop.removeAttribute("show");
                                pop.style.visibility = "hidden";
                                pop.style.opacity = "0";
                            }
                            else {
                            }
                        };
                        _documentClickEvent.push(click);
                        document.addEventListener("click", click);
                    });
                }
                else {
                    init(target, {
                        dir: "",
                        trigger: "hover,focus",
                    });
                }
            });
            document.body.append(pop);
        }
        render();
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
if (!customElements.get("my-button")) {
    customElements.define("my-popover", button);
}
exports.default = button;
