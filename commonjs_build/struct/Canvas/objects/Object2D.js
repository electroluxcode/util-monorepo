"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Object2D = void 0;
const Vector2_js_1 = require("../math/Vector2.js");
const EventDispatcher_js_1 = require("../core/EventDispatcher.js");
const Matrix3_js_1 = require("../math/Matrix3.js");
const MathUtils_js_1 = require("../math/MathUtils.js");
class Object2D extends EventDispatcher_js_1.EventDispatcher {
    // 位置
    position = new Vector2_js_1.Vector2();
    // 旋转
    rotate = 0;
    // 缩放
    scale = new Vector2_js_1.Vector2(1, 1);
    // 可见性
    visible = true;
    // 渲染顺序
    index = 0;
    // 名称
    name = '';
    // 父级
    parent;
    // 是否受相机影响-只适用于Scene的children元素
    enableCamera = true;
    // UUID
    uuid = (0, MathUtils_js_1.generateUUID)();
    // 类型
    isObject2D = true;
    /* 本地模型矩阵 */
    get matrix() {
        const { position, rotate, scale } = this;
        return new Matrix3_js_1.Matrix3()
            .scale(scale.x, scale.y)
            .rotate(rotate)
            .translate(position.x, position.y);
    }
    /* 世界模型矩阵 */
    get worldMatrix() {
        const { parent, matrix } = this;
        if (parent) {
            return parent.worldMatrix.multiply(matrix);
        }
        else {
            return matrix;
        }
    }
    /* pvm 投影视图模型矩阵 */
    get pvmMatrix() {
        const scene = this.getScene();
        if (scene) {
            const { camera } = scene;
            return new Matrix3_js_1.Matrix3().multiplyMatrices(camera.pvMatrix, this.worldMatrix);
        }
        else {
            return this.worldMatrix;
        }
    }
    /* 总缩放量 */
    get worldScale() {
        const { scale, parent } = this;
        if (parent) {
            return scale.clone().multiply(parent.worldScale);
        }
        else {
            return scale;
        }
    }
    /* 先变换(缩放+旋转)后位移 */
    transform(ctx) {
        const { position, rotate, scale } = this;
        ctx.translate(position.x, position.y);
        ctx.rotate(rotate);
        ctx.scale(scale.x, scale.y);
    }
    /* 从父级中删除自身 */
    remove() {
        const { parent } = this;
        parent && parent.remove(this);
    }
    /* 获取场景 */
    getScene() {
        if ('isScene' in this) {
            return this;
        }
        else if (this.parent) {
            return this.parent.getScene();
        }
        else {
            return null;
        }
    }
    /* 绘图 */
    draw(ctx) {
        if (!this.visible) {
            return;
        }
        ctx.save();
        /*  矩阵变换 */
        this.transform(ctx);
        /* 绘制图形 */
        this.drawShape(ctx);
        ctx.restore();
    }
    /* 绘制图形-接口 */
    drawShape(ctx) { }
    /* 创建路径-接口 */
    crtPath(ctx, projectionMatrix) { }
}
exports.Object2D = Object2D;
