"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera = void 0;
const Matrix3_js_1 = require("../math/Matrix3.js");
const Vector2_js_1 = require("../math/Vector2.js");
class Camera {
    position;
    zoom;
    /**
     *
     * @param x
     * @param y
     * @param zoom ju
     */
    constructor(x = 0, y = 0, zoom = 1) {
        this.position = new Vector2_js_1.Vector2(x, y);
        this.zoom = zoom;
    }
    /* 视图投影矩阵(行列式)：先逆向缩放，再逆向位置 */
    get pvMatrix() {
        const { position: { x, y }, zoom, } = this;
        return new Matrix3_js_1.Matrix3().scale(1 / zoom).translate(-x, -y);
    }
    /* 使用视图投影矩阵反向变换物体*/
    transformInvert(ctx) {
        const { position: { x, y }, zoom, } = this;
        const scale = 1 / zoom;
        ctx.translate(-x, -y);
        ctx.scale(scale, scale);
    }
}
exports.Camera = Camera;
