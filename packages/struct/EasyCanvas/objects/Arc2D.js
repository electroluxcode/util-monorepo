import { Object2D } from "../core/Object2D.js";
import { Vector2 } from "../math/Vector2.js";
import { crtPathByMatrix } from "./ObjectUtils.js";
/* 文字对齐方式引起的偏移量 */
class Arc2D extends Object2D {
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
        return new Vector2(this.radius * 2, this.radius * 2);
    }
    /* 绘制图像边界 */
    crtPath(ctx, matrix = this.pvmMatrix) {
        this.computeBoundingBox();
        const { boundingBox: { min: { x: x0, y: y0 }, max: { x: x1, y: y1 }, }, } = this;
        crtPathByMatrix(ctx, [x0, y0, x1, y0, x1, y1, x0, y1], matrix);
    }
    /* 注意:计算边界盒子 */
    computeBoundingBox() {
        const { offset: { x, y }, boundingBox: { min, max }, size, offset, radius, } = this;
        min.set(offset.x - radius, offset.y - radius);
        max.addVectors(min, size);
    }
    /* 绘图 */
    drawShape(ctx) {
        const { offset: { x, y }, radius, style, } = this;
        ctx.beginPath();
        // 绘图
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        // style[`fillStyle`];
        ctx.fillStyle = this.color; //将线条颜色设置为蓝色
        ctx.fill(); //stroke() 方法默认颜色是黑色（如果没有上面一行，则会是黑色）。
        ctx.closePath();
    }
}
export { Arc2D };
