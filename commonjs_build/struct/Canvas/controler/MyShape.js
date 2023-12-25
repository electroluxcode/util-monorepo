"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyShape = void 0;
const Vector2_js_1 = require("../math/Vector2.js");
const ObjectUtils_js_1 = require("../objects/ObjectUtils.js");
class MyShape {
    // 鼠标位置
    mousePos = new Vector2_js_1.Vector2();
    // 图案中心位
    center = new Vector2_js_1.Vector2();
    // 图案边框的顶点集合
    vertives = [];
    // 移动图案
    moveVertices = [0, 0, 14, 14, 6, 14, 0, 20];
    // 旋转图案，由[-15, 0, -9, -5, -9, -1, -5, -1, -1, 1, 1, 5, 1, 9, 5, 9, 0, 15, -5, 9, -1,9, -1, 5, -2.2, 2.2, -5, 1, -9, 1, -9, 5]旋转45°得来
    rotateVertices = [
        -10.61, -10.61, -2.83, -9.9, -5.66, -7.07, -2.83, -4.24, -1.41, 0, -2.83,
        4.24, -5.66, 7.07, -2.83, 9.9, -10.61, 10.61, -9.9, 2.83, -7.07, 5.66,
        -4.24, 2.83, -3.11, 0, -4.24, -2.83, -7.07, -5.66, -9.9, -2.83,
    ];
    // 缩放图案
    scaleVertices = [
        1, 4, 1, 1, 5, 1, 5, 5, 11, 0, 5, -5, 5, -1, 1, -1, 1, -4, -1, -4, -1, -1,
        -5, -1, -5, -5, -11, 0, -5, 5, -5, 1, -1, 1, -1, 4,
    ];
    fillStyle = '#000';
    strokeStyle = '#fff';
    constructor(attr = {}) {
        Object.assign(this, attr);
    }
    // scaleY状态
    // 移动状态
    move(ctx) {
        ctx.beginPath();
        (0, ObjectUtils_js_1.crtPath)(ctx, this.moveVertices, true);
    }
    draw(ctx, state) {
        if (!state) {
            return;
        }
        const { mousePos, fillStyle, strokeStyle } = this;
        ctx.save();
        ctx.fillStyle = fillStyle;
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = 2;
        ctx.translate(mousePos.x, mousePos.y);
        this[state](ctx);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }
}
exports.MyShape = MyShape;
