import { Matrix3 } from '../math/Matrix3.js';
import { Vector2 } from '../math/Vector2.js';
import { BasicStyle } from '../style/BasicStyle.js';
import { Object2D } from './Object2D.js';
import { crtPathByMatrix } from './ObjectUtils.js';
class Img2D extends Object2D {
    image = new Image();
    offset = new Vector2();
    size = new Vector2(300, 150);
    view;
    style = new BasicStyle();
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
        return this.worldMatrix.multiply(new Matrix3().makeTranslation(x, y));
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
        return this.pvmMatrix.multiply(new Matrix3().makeTranslation(x, y));
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
    /* 绘制图像边界 */
    crtPath(ctx, matrix = this.pvmoMatrix) {
        const { size: { x: imgW, y: imgH }, } = this;
        crtPathByMatrix(ctx, [0, 0, imgW, 0, imgW, imgH, 0, imgH], matrix, true);
    }
}
export { Img2D };
