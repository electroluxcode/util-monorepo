import Base from "../base.js";
// @ts-ignore
import B from "./B.css?inline" assert { type: "css" };
// @ts-ignore
import L from "./L.css?inline" assert { type: "css" };
// @ts-ignore
import R from "./R.css?inline" assert { type: "css" };
// @ts-ignore
import T from "./T.css?inline" assert { type: "css" };
class button extends Base {
    // step1 :定义 属性 和 监听的属性
    #btnEl;
    static get observedAttributes() {
        return ["disabled"];
    }
    constructor() {
        super();
        this.adoptedStyle(B);
        this.adoptedStyle(L);
        this.adoptedStyle(R);
        this.adoptedStyle(T);
        this.shadowRootInit.innerHTML = ` 
        <div id="pop" class="pop" dir="t" part="pop" >
            <div>
                pop本来应该隐藏的元素
            </div>
           
       
    </div>
          `;
        let pop = this.shadowRootInit.querySelector("#pop");
        // 需要被触发的元素
        let target = document.querySelector(".target");
        // webcomponent 特供
        let node = pop.innerHTML;
        console.log(pop, target);
        let _documentClickEvent = [];
        let isHover;
        let timer;
        let targetList;
        let open;
        let isHoverPoper;
        // ----   底层  -------
        function setPosition() {
            const { left, top, right, bottom, width } = target.getBoundingClientRect();
            // console.log("重新计算:",{ left, top, right, bottom, width })
            pop.style.setProperty("--left", parseInt(left + window.pageXOffset));
            pop.style.setProperty("--top", parseInt(top + window.pageYOffset));
            pop.style.setProperty("--right", parseInt(right + window.pageXOffset));
            pop.style.setProperty("--bottom", parseInt(bottom + window.pageYOffset));
        }
        function init(target, option = {
            dir: "",
            trigger: "hover,focus",
        }) {
            // if (!target) return;
            // if (!target.clientWidth) return;
            console.log("------------");
            pop.target = target;
            if (option.dir.includes(",")) {
                // 这样子赋值可以直接赋值给element里面的属性
                pop.auto = option.dir;
                // pop.dir = option.dir.split(",")[0];
            }
            // hover
            if (option.trigger.includes("hover")) {
                console.log("enter");
                target.addEventListener("mouseenter", () => {
                    console.log("enter");
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
        let mount = false;
        let that = this;
        function render() {
            // targetList = targetAll();
            targetList = [target];
            console.log("target------------:", targetList);
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
                            console.log("isHover || !isHoverPoper", isHover, isHoverPoper);
                            if (isHover || isHoverPoper) {
                                return;
                            }
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
                        // _documentClickEvent.push(click);
                        document.addEventListener("click", click);
                    });
                    target.addEventListener("mouseenter", () => {
                        // console.log("target mouseenter触发")
                        isHover = true;
                        open = true;
                    });
                    target.addEventListener("mouseleave", (ev) => {
                        isHover = false;
                        open = false;
                    });
                    pop.addEventListener("mouseenter", () => {
                        isHoverPoper = true;
                        open = true;
                    });
                    pop.addEventListener("mouseleave", (ev) => {
                        isHoverPoper = false;
                        open = false;
                    });
                }
                else {
                    init(target, {
                        dir: "",
                        trigger: "hover,focus",
                    });
                }
            });
            if (!mount) {
                document.body.append(that);
                mount = true;
            }
            // document.body.append(pop);
        }
        render();
    }
    connectedCallback() {
        let that = this;
        this.addEventListener("click", function () {
            console.log("我点了:", this.shadowRoot);
        });
    }
    attributeChangedCallback(name, oldValue, newValue) { }
}
// 通过方法 来new出来
if (!customElements.get("my-popover")) {
    customElements.define("my-popover", button);
}
export default button;
