"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextStyle = void 0;
const StandStyle_js_1 = require("./StandStyle.js");
class TextStyle extends StandStyle_js_1.StandStyle {
    fontStyle = '';
    fontWeight = '';
    fontSize = 12;
    fontFamily = 'arial';
    textAlign = 'start';
    textBaseline = 'alphabetic';
    constructor(attr = {}) {
        super();
        this.setOption(attr);
    }
    /* 设置样式 */
    setOption(attr = {}) {
        Object.assign(this, attr);
    }
    /* 应用样式 */
    apply(ctx) {
        super.apply(ctx);
        this.setFont(ctx);
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
    }
    /* font 相关样式 */
    setFont(ctx) {
        ctx.font = `${this.fontStyle} ${this.fontWeight} ${this.fontSize}px  ${this.fontFamily}`;
    }
}
exports.TextStyle = TextStyle;
