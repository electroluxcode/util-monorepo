"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Img2D = void 0;
const Matrix3_js_1 = require("../math/Matrix3.js");
const Vector2_js_1 = require("../math/Vector2.js");
const BasicStyle_js_1 = require("../style/BasicStyle.js");
const Object2D_js_1 = require("./Object2D.js");
const ObjectUtils_js_1 = require("./ObjectUtils.js");
class Img2D extends Object2D_js_1.Object2D {
    image = new Image();
    offset = new Vector2_js_1.Vector2();
    size = new Vector2_js_1.Vector2(300, 150);
    view;
    style = new BasicStyle_js_1.BasicStyle();
    // 类型
    isImg = true;
    constructor(attr = {}) {
        super();
        this.setOption(attr);
    }
    /* 属性设置 */
    setOption(attr) {
        for (let [key, val] of Object.entries(attr)) {
            switch (key) {
                case 'src':
                    if (this.image instanceof Image) {
                        this.image.src = val;
                    }
                    break;
                case 'style':
                    this.style.setOption(val);
                    break;
                default:
                    this[key] = val;
            }
        }
    }
    /* 世界模型矩阵*偏移矩阵 */
    get moMatrix() {
        const { offset: { x, y }, } = this;
        return this.worldMatrix.multiply(new Matrix3_js_1.Matrix3().makeTranslation(x, y));
    }
    // 计算边界盒子，很牛皮
    computeBoundingBox() {
        const { boundingBox: { min, max }, size, offset, } = this;
        min.copy(offset);
        max.addVectors(offset, size);
    }
    /* 视图投影矩阵*世界模型矩阵*偏移矩阵  */
    get pvmoMatrix() {
        const { offset: { x, y }, } = this;
        return this.pvmMatrix.multiply(new Matrix3_js_1.Matrix3().makeTranslation(x, y));
    }
    /* 绘图 */
    drawShape(ctx) {
        const { image, offset, size, view, style } = this;
        //样式
        style.apply(ctx);
        // 绘制图像
        if (view) {
            ctx.drawImage(image, view.x, view.y, view.width, view.height, offset.x, offset.y, size.x, size.y);
        }
        else {
            ctx.drawImage(image, offset.x, offset.y, size.x, size.y);
        }
    }
    /* 绘制图像边界, */
    crtPath(ctx, matrix = this.pvmoMatrix, isShow = false, style = { width: 5, color: "red" }) {
        const { size: { x: imgW, y: imgH }, } = this;
        // 第二个参数是宽高 和周围的边界
        // 第三个参数是 默认是正方形,然后向着指定方向做位移
        (0, ObjectUtils_js_1.crtPathByMatrix)(ctx, [0, 0, imgW, 0, imgW, imgH, 0, imgH], matrix, true, isShow, style);
    }
}
exports.Img2D = Img2D;
