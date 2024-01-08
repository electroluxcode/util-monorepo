"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rect2D = void 0;
const Object2D_js_1 = require("../core/Object2D.js");
const Vector2_js_1 = require("../math/Vector2.js");
const ObjectUtils_js_1 = require("./ObjectUtils.js");
/* 文字对齐方式引起的偏移量 */
class Rect2D extends Object2D_js_1.Object2D {
    width;
    height;
    color;
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
        return new Vector2_js_1.Vector2(this.width, this.height);
    }
    /* 绘制图像边界 */
    crtPath(ctx, matrix = this.pvmMatrix) {
        this.computeBoundingBox();
        const { boundingBox: { min: { x: x0, y: y0 }, max: { x: x1, y: y1 }, }, } = this;
        (0, ObjectUtils_js_1.crtPathByMatrix)(ctx, [x0, y0, x1, y0, x1, y1, x0, y1], matrix);
    }
    /* 注意:计算边界盒子 */
    computeBoundingBox() {
        const { boundingBox: { min, max }, size, offset, } = this;
        min.set(offset.x, offset.y);
        max.addVectors(min, size);
    }
    /* 绘图 */
    drawShape(ctx) {
        const { boundingBox: { min, max }, offset: { x, y }, } = this;
        // 绘图
        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, this.width, this.height);
        ctx.closePath();
    }
}
exports.Rect2D = Rect2D;
