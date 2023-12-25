"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Scene_js_1 = require("../../core/Scene.js");
const MyShape_js_1 = require("../../ext/MyShape.js");
const Vector2_js_1 = require("../../math/Vector2.js");
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
const mouseClipPos = new Vector2_js_1.Vector2(Infinity);
let te = new MyShape_js_1.MyShape({
    mousePos: mouseClipPos,
});
scene.add(te);
canvas.addEventListener('mousemove', ({ clientX, clientY }) => {
    // 转化成 以中心作为基础点的坐标
    mouseClipPos.copy(scene.clientToClip(clientX, clientY));
    te.draw(ctx);
    scene.render();
});
ani();
function ani(time = 0) {
    scene.render();
    requestAnimationFrame(() => { ani(time + 15); });
}
