"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scene = void 0;
const Camera_js_1 = require("./Camera.js");
const Group_js_1 = require("../objects/Group.js");
const Vector2_js_1 = require("../math/Vector2.js");
const Matrix3_js_1 = require("../math/Matrix3.js");
class Scene extends Group_js_1.Group {
    // canvas画布
    _canvas = document.createElement('canvas');
    // canvas 上下文对象
    ctx = this._canvas.getContext('2d');
    // 相机
    camera = new Camera_js_1.Camera();
    // 是否自动清理画布
    autoClear = true;
    // 类型
    isScene = true;
    constructor(attr = {}) {
        super();
        this.setOption(attr);
    }
    get canvas() {
        return this._canvas;
    }
    set canvas(value) {
        if (this._canvas === value) {
            return;
        }
        this._canvas = value;
        this.ctx = this.canvas.getContext('2d');
    }
    /* 设置属性 */
    setOption(attr) {
        for (let [key, val] of Object.entries(attr)) {
            this[key] = val;
        }
    }
    /*  渲染 */
    render() {
        const { canvas: { width, height }, ctx, camera, children, autoClear, } = this;
        ctx.save();
        // 清理画布
        autoClear && ctx.clearRect(0, 0, width, height);
        // 裁剪坐标系：将canvas坐标系的原点移动到canvas画布中心
        ctx.translate(width / 2, height / 2);
        // 渲染子对象
        for (let obj of children) {
            ctx.save();
            // 视图投影矩阵
            obj.enableCamera && camera.transformInvert(ctx);
            // 绘图
            obj.draw(ctx);
            ctx.restore();
        }
        ctx.restore();
    }
    /* client坐标转canvas坐标 */
    clientToCanvas(clientX, clientY) {
        const { canvas } = this;
        const { left, top } = canvas.getBoundingClientRect();
        return new Vector2_js_1.Vector2(clientX - left, clientY - top);
    }
    /* canvas坐标转裁剪坐标 */
    canvastoClip({ x, y }) {
        const { canvas: { width, height }, } = this;
        return new Vector2_js_1.Vector2(x - width / 2, y - height / 2);
    }
    /* client坐标转裁剪坐标 */
    clientToClip(clientX, clientY) {
        return this.canvastoClip(this.clientToCanvas(clientX, clientY));
    }
    /* 基于某个坐标系，判断某个点是否在图形内 */
    isPointInObj(obj, mp, matrix = new Matrix3_js_1.Matrix3()) {
        const { ctx } = this;
        ctx.beginPath();
        obj.crtPath(ctx, matrix);
        return ctx.isPointInPath(mp.x, mp.y);
    }
}
exports.Scene = Scene;
