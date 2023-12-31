import { BasicStyle } from './BasicStyle.js';
class StandStyle extends BasicStyle {
    strokeStyle;
    fillStyle;
    lineWidth = 1;
    lineDash;
    lineDashOffset = 0;
    lineCap = 'butt';
    lineJoin = 'miter';
    miterLimit = 10;
    // 填充和描边的顺序, 默认0，即先填充再描边
    order = 0;
    constructor(attr = {}) {
        super();
        this.setOption(attr);
    }
    /* 设置样式 */
    setOption(attr = {}) {
        Object.assign(this, attr);
    }
    /* 获取有顺序的绘图方法 */
    get drawOrder() {
        return this.order ? ['fill', 'stroke'] : ['stroke', 'fill'];
    }
    /* 应用样式 */
    apply(ctx) {
        super.apply(ctx);
        const { fillStyle, strokeStyle, lineWidth, lineCap, lineJoin, miterLimit, lineDash, lineDashOffset, } = this;
        if (strokeStyle) {
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = lineCap;
            ctx.lineJoin = lineJoin;
            ctx.miterLimit = miterLimit;
            if (lineDash) {
                ctx.setLineDash(lineDash);
                ctx.lineDashOffset = lineDashOffset;
            }
        }
        fillStyle && (ctx.fillStyle = fillStyle);
    }
}
export { StandStyle };
