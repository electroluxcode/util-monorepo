import { Vector2 } from '../math/Vector2.js';
import { TextStyle } from './TextStyle.js';
import { Object2D } from '../core/Object2D.js';
import { crtPathByMatrix } from './ObjectUtils.js';
/* 虚拟上下文对象 */
const virtuallyCtx = document.createElement('canvas').getContext('2d');
/* 文字对齐方式引起的偏移量 */
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
class Text2D extends Object2D {
    text = '';
    maxWidth;
    style = new TextStyle();
    // 类型
    isText = true;
    constructor(attr = {}) {
        super();
        this.setOption(attr);
    }
    /* 属性设置 */
    setOption(attr) {
        for (let [key, val] of Object.entries(attr)) {
            if (key === 'style') {
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
        return new Vector2(w, style.fontSize);
    }
    /* 绘制图像边界 */
    crtPath(ctx, matrix = this.pvmMatrix) {
        this.computeBoundingBox();
        const { boundingBox: { min: { x: x0, y: y0 }, max: { x: x1, y: y1 }, }, } = this;
        crtPathByMatrix(ctx, [x0, y0, x1, y0, x1, y1, x0, y1], matrix);
    }
    /* 计算边界盒子 */
    computeBoundingBox() {
        console.log('zptest:crtPath:', this);
        const { boundingBox: { min, max }, size, offset, style: { textAlign, textBaseline }, } = this;
        min.set(offset.x + size.x * alignRatio[textAlign], offset.y + size.y * baselineRatio[textBaseline]);
        max.addVectors(min, size);
    }
    /* 绘图 */
    drawShape(ctx) {
        const { text, offset: { x, y }, maxWidth, style, } = this;
        //样式
        style.apply(ctx);
        // 绘图
        for (let method of style.drawOrder) {
            style[`${method}Style`] && ctx[`${method}Text`](text, x, y, maxWidth);
        }
    }
}
export { Text2D };
