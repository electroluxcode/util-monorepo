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
    /**
     * @des 设置属性 和 add 图层后 把canvas 传递过去就可以了
     * canvas 被设置之后会自动触发 得到 ctx 的事件
     * @param attr
     */
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
        // 里面的children 元素做一次清空 并且向着中间移动
        autoClear && ctx.clearRect(0, 0, width, height);
        // 裁剪坐标系：将canvas坐标系的原点移动到canvas画布中心。
        // 因为之后是需要 防止相机的 相机处于 0 0 点并不是很好
        ctx.translate(width / 2, height / 2);
        // 渲染子对象
        for (let obj of children) {
            ctx.save();
            // 如果要使用相机，要么要 对相机 的 视图投影 矩阵做逆向变化。这部分很简单
            /** const {position: { x, y },zoom, } = this
                const scale = 1 / zoom
                ctx.translate(-x, -y)
                ctx.scale(scale, scale) */
            obj.enableCamera && camera.transformInvert(ctx);
            // fix(bug):内部添加了beginpath.也就是说会绘制 这段代码的 path。这就导致了重叠。
            // obj.crtPath(ctx,obj.pvmoMatrix,true)
            // 绘图.回顾一下这个方法是object2d 上面的 方法
            // 首先是进行矩阵变化，然后进行 drawimage 之类的 drawshape 方法
            // 注意 每一个图层 需要在最终 绘制的时候调用 
            obj.draw(ctx);
            ctx.restore();
        }
        ctx.restore();
    }
    /**
     * @des client坐标转canvas坐标 我们需要 鼠标位置 减去 canvas 这个 元素的 左边和上面的位置
     */
    clientToCanvas(clientX, clientY) {
        const { canvas } = this;
        const { left, top } = canvas.getBoundingClientRect();
        return new Vector2_js_1.Vector2(clientX - left, clientY - top);
    }
    /**
     * @des canvas坐标转裁剪坐标(工具方法) 因为 在 render 的时候 我们会  偏移 到中间去
     */
    canvastoClip({ x, y }) {
        const { canvas: { width, height }, } = this;
        return new Vector2_js_1.Vector2(x - width / 2, y - height / 2);
    }
    /**
     * @des client坐标转裁剪坐标。一般是 做鼠标事件的时候用的，因此clientToClip 是后来调用的 向着左边平移 一半确实是正确的坐标系
     */
    clientToClip(clientX, clientY) {
        return this.canvastoClip(this.clientToCanvas(clientX, clientY));
    }
    /**
     * @des 基于某个坐标系，判断某个点是否在图形内
     * 需要先绘制 边缘路径接下来再进行 判断  调用原生 的 isPointInPath 判断就可以了
     * isPointInPath(x,y) 面向的对象是路径，所以对文字、fillRect()、strokeRect()不好使，
     */
    isPointInObj(obj, mp, matrix = new Matrix3_js_1.Matrix3()) {
        const { ctx } = this;
        ctx.beginPath();
        obj.crtPath(ctx, matrix, false);
        return ctx.isPointInPath(mp.x, mp.y);
    }
}
exports.Scene = Scene;
