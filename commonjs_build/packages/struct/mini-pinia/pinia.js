"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Pinia_js_1 = require("./components/Pinia.js");
let b = (0, Pinia_js_1.defineStore)({
    id: 2,
    state: {
        name: "woni",
        age: 1,
    },
    getters: {
        // state
        compute() {
            return this.name + "--我是compute";
        },
    },
    actions: {
        stateChange(id) { },
        anotherChange(name) {
            this["name"] = name;
        },
        add() {
            this.age = this.age + 1;
            console.log("this.age:", this.age);
        },
        minus() {
            this.age = this.age - 1;
        },
    },
    enhancer: {
        middleware() {
            console.log("你好，我是middleware");
        },
    },
});
let bcase = b();
// console.log(bcase.name);
// bcase.anotherChange("xiaoming");
// console.log(bcase.name);
// 知识点3 :实例
let minusButton = document.querySelector(".minus");
let plusButton = document.querySelector(".plus");
let container = document.querySelector(".input");
minusButton?.addEventListener("click", () => {
    bcase.minus();
});
plusButton?.addEventListener("click", () => {
    bcase.add();
});
// @ts-ignore
container.innerHTML = bcase.age;
const render = () => {
    console.log("render");
    // @ts-ignore
    container.innerHTML = bcase.age;
};
bcase.subscribe(render);
