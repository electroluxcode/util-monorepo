"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text2D = void 0;
const Vector2_js_1 = require("../math/Vector2.js");
const TextStyle_js_1 = require("./TextStyle.js");
const Object2D_js_1 = require("../core/Object2D.js");
const ObjectUtils_js_1 = require("./ObjectUtils.js");
/* 虚拟上下文对象 */
const virtuallyCtx = document
    .createElement("canvas")
    .getContext("2d");
/* 文字对齐方式引起的偏移量(ps算出来的) */
const alignRatio = {
    start: 0,
    left: 0,
    center: -0.5,
    end: -1,
    right: -1,
};
const baselineRatio = {
    top: 0,
    middle: -0.5,
    bottom: -1,
    hanging: -0.05,
    alphabetic: -0.78,
    ideographic: -1,
};
class Text2D extends Object2D_js_1.Object2D {
    text = "";
    maxWidth;
    style = new TextStyle_js_1.TextStyle();
    // 类型
    isText = true;
    constructor(attr = {}) {
        super();
        this.setOption(attr);
    }
    /* 属性设置 */
    setOption(attr) {
        for (let [key, val] of Object.entries(attr)) {
            if (key === "style") {
                this.style.setOption(val);
            }
            else {
                this[key] = val;
            }
        }
    }
    /* 文本尺寸 */
    get size() {
        const { style, text, maxWidth } = this;
        style.setFont(virtuallyCtx);
        const { width } = virtuallyCtx.measureText(text);
        let w = maxWidth === undefined ? width : Math.min(width, maxWidth);
        return new Vector2_js_1.Vector2(w, style.fontSize);
    }
    /* 绘制图像边界 */
    crtPath(ctx, matrix = this.pvmMatrix) {
        this.computeBoundingBox();
        const { boundingBox: { min: { x: x0, y: y0 }, max: { x: x1, y: y1 }, }, } = this;
        (0, ObjectUtils_js_1.crtPathByMatrix)(ctx, [x0, y0, x1, y0, x1, y1, x0, y1], matrix);
    }
    /* 计算边界盒子 */
    computeBoundingBox() {
        const { boundingBox: { min, max }, size, offset, style: { textAlign, textBaseline }, } = this;
        min.set(offset.x + size.x * alignRatio[textAlign], offset.y + size.y * baselineRatio[textBaseline]);
        max.addVectors(min, size);
    }
    /* 绘图 */
    drawShape(ctx) {
        const { text, offset: { x, y }, maxWidth, style, } = this;
        //样式
        style.apply(ctx);
        // 绘图 StandStyle.ts 里面 定义了 method 主要是
        for (let method of style.drawOrder) {
            style[`${method}Style`] && ctx[`${method}Text`](text, x, y, maxWidth);
        }
    }
}
exports.Text2D = Text2D;
