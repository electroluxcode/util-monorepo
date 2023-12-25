"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Scene_js_1 = require("../../core/Scene.js");
const MyFrame_js_1 = require("../../ext/MyFrame.js");
// step1:基本参数初始化
let size = {
    width: 400,
    height: 400
};
const canvas = document.querySelector("canvas");
canvas.width = size.width;
canvas.height = size.height;
const ctx = canvas?.getContext('2d');
const scene = new Scene_js_1.Scene();
scene.setOption({ canvas });
let frame = new MyFrame_js_1.MyFrame();
canvas.addEventListener('mousemove', ({ clientX, clientY }) => {
    // 转化成 以中心作为基础点的坐标
    scene.render();
});
ani();
function ani(time = 0) {
    frame.draw(ctx);
    scene.render();
    requestAnimationFrame(() => { ani(time + 15); });
}
