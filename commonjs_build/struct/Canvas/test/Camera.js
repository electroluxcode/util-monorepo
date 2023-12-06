"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Camera_js_1 = require("../core/Camera.js");
// step1:基本参数初始化
let size = {
    width: 300,
    height: 300
};
const canvas = document.querySelector("canvas");
canvas.width = size.width;
canvas.height = size.height;
const ctx = canvas?.getContext('2d');
// step2:相机方法的测试原理是 逆向操作 
// 对应 x y 距离  距离越短越大
const camera = new Camera_js_1.Camera(10, 0, 1);
function matrixTest(ctx) {
    ctx.save();
    camera.transformInvert(ctx);
    ctx.fillRect(0, 0, 200, 100);
    ctx.restore();
}
ctx && matrixTest(ctx);
