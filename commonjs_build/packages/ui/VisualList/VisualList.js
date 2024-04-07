"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_js_1 = require("./data.js");
// 这里可以设置插入的元素  p h1 h2 等都可以
let createElement = "p";
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
                }
                else {
                    // console.log("触发set方法:", key, value, target);
                    let container = document.querySelector(".inner");
                    container.innerHTML = "";
                    target.value.forEach((element) => {
                        let p = document.createElement(createElement);
                        p.innerHTML = element.id;
                        container?.appendChild(p);
                        console.log(element);
                    });
                }
                return true;
            },
        });
        return ProxyRenderData;
    }
}
/**
 * @des 数据源交给代理 需要维护两个数组 第一个数组是初始数组，第二个数组是渲染数组
 * @des 基本dom结构需要三层 第一层是可视区(爷爷)，第二层基本不需要定义(父亲),第三层是我们的虚拟列表
 */
class VisualList {
    ViewObject;
    // 代理数据
    constructor(param) {
        if (param.mode == "event") {
            this.eventMode(param);
        }
    }
    /**
     * @des 需要使用者绑定一个render方法
     * @des 注意使用者需要在render方法中进行可视区数据的绑定
     * @param param
     */
    eventMode(param) {
        // 初始渲染一个
        param.render([param.data[0]]);
        queueMicrotask(() => {
            let ChildrenElement = document.querySelector(param.ChildrenElement);
            let shouldDisplayCount = Math.floor(param.ViewElement.clientHeight / ChildrenElement.clientHeight);
            shouldDisplayCount = shouldDisplayCount + 3;
            // 定高设置
            // ChildrenElement.parentElement.style.height =
            // 	ChildrenElement.clientHeight * param.data.length + "px";
            param.render(param.data.slice(0, 0 + shouldDisplayCount));
            param.ViewElement.addEventListener("scroll", () => {
                let ChildrenElement = document.querySelector(param.ChildrenElement);
                let BeforeElementCount = Math.floor(param.ViewElement.scrollTop / ChildrenElement.clientHeight);
                // 设置偏移量
                ChildrenElement.parentElement.style.position = "relative";
                ChildrenElement.parentElement.style.top =
                    param.ViewElement.scrollTop + "px";
                param.render(param.data.slice(BeforeElementCount, BeforeElementCount + shouldDisplayCount));
            });
        });
    }
}
let test = new DataProxy([]);
let case1 = test.ProxyGet();
new VisualList({
    ParentElement: document.querySelector(".container_layer"),
    ChildrenElement: createElement,
    ViewElement: document.querySelector(".container"),
    data: data_js_1.data,
    mode: "event",
    render: (data) => {
        console.log("render:", data);
        case1.value = data;
    },
});
