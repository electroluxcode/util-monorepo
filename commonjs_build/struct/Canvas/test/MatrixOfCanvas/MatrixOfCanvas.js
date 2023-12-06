"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector2_js_1 = require("../../math/Vector2.js");
const Matrix3_js_1 = require("../../math/Matrix3.js");
// step1:基本参数初始化
let size = {
    width: 300,
    height: 300
};
const canvas = document.querySelector("canvas");
canvas.width = size.width;
canvas.height = size.height;
const ctx = canvas?.getContext('2d');
// step2:测试
/* 矩形的初始顶点(长方形) */
const vertices = [
    0, 0,
    100, 0,
    100, 50,
    0, 50,
];
const position = new Vector2_js_1.Vector2(0, 100);
const rotate = 0.4;
// 从结果来看，拉成一个正方形
const scale = new Vector2_js_1.Vector2(1, 2);
function drawRect(ctx, vertices, color = 'black', lineWidth = 0) {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(vertices[0], vertices[1]);
    for (let i = 2, len = vertices.length; i < len; i += 2) {
        ctx.lineTo(vertices[i], vertices[i + 1]);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}
// step2.1 测试平移 | 旋转 | 缩放
// ctx.save()
// ctx.translate(position.x, position.y)
// ctx.rotate(rotate)
// ctx.scale(scale.x, scale.y)
// drawRect(ctx, vertices, 'red', 10)
// ctx.restore()
const matrix = new Matrix3_js_1.Matrix3()
    .scale(scale.x, scale.y)
    .rotate(rotate)
    .translate(position.x, position.y);
// step2.2 矩阵 顺序不能变
ctx.save();
const { elements: e } = matrix;
console.log(e);
ctx.save();
ctx.transform(e[0], e[1], e[3], e[4], e[6], e[7]);
drawRect(ctx, vertices, '#00acec', 10);
ctx.restore();
// step2.3  顶点变化
// ctx.save()
// const worldVertives: number[] = []
// for (let i = 0, len = vertices.length; i < len; i += 2) {
//     const { x, y } = new Vector2(vertices[i], vertices[i + 1]).applyMatrix3(
//         matrix
//     )
//     worldVertives.push(x, y)
// }
// drawRect(ctx, worldVertives,  '#00acec', 10)
// ctx.restore()
