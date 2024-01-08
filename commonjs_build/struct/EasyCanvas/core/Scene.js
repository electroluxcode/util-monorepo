"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scene = void 0;
const Camera_js_1 = require("./Camera.js");
const Group_js_1 = require("./Group.js");
const Object2D_js_1 = require("./Object2D.js");
const Vector2_js_1 = require("../math/Vector2.js");
const Matrix3_js_1 = require("../math/Matrix3.js");
class Scene extends Object2D_js_1.Object2D {
    // canvas画布
    _canvas = document.createElement("canvas");
    // canvas 上下文对象
    ctx = this._canvas.getContext("2d");
    // 相机
    camera = new Camera_js_1.Camera();
    // 是否自动清理画布
    autoClear = true;
    // 类型
    isScene = true;
    children = [];
    // 居中的信息
    ScenePosition;
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
        this.ctx = this.canvas.getContext("2d");
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
     * @des client坐标转裁剪坐标。一般是 做鼠标事件的时候用的，因此clientToClip 是后来调用的 向着左边平移 一半确实是正确的坐标系
     */
    clientToClip(clientX, clientY) {
        const { canvas } = this;
        const { left, top } = canvas.getBoundingClientRect();
        let temp = new Vector2_js_1.Vector2(clientX - left, clientY - top);
        const { canvas: { width, height }, } = this;
        return new Vector2_js_1.Vector2(temp.x - width / 2, temp.y - height / 2);
    }
    /**
     * @des 基于中心坐标系，判断某个点是否在图形内
     * 需要先绘制 边缘路径接下来再进行 判断  调用原生 的 isPointInPath 判断就可以了
     * isPointInPath(x,y) 面向的对象是路径，所以对文字、fillRect()、strokeRect()不好使，
     */
    isPointInObj(obj, mp, matrix = new Matrix3_js_1.Matrix3()) {
        const { ctx } = this;
        ctx.beginPath();
        obj.crtPath(ctx, matrix, false);
        console.log("zptest:isPointInObj", { obj, mp, matrix });
        return ctx.isPointInPath(mp.x, mp.y);
    }
    add(...objs) {
        for (let obj of objs) {
            if (obj === this) {
                return this;
            }
            obj.parent && obj.remove();
            obj.parent = this;
            this.children.push(obj);
            this.emit({ type: "add", obj });
        }
        this.sort();
        return this;
    }
    /* 根据名称获取元素 */
    getObjectByName(name) {
        return this.getObjectByProperty("name", name);
    }
    /* 根据某个属性的值获取子对象 */
    getObjectByProperty(name, value) {
        const { children } = this;
        for (let i = 0, l = children.length; i < l; i++) {
            const child = children[i];
            if (child[name] === value) {
                return child;
            }
            else if (child instanceof Group_js_1.Group) {
                const obj = child.getObjectByProperty(name, value);
                if (obj) {
                    return obj;
                }
            }
        }
        return undefined;
    }
    /* 遍历元素 */
    traverse(callback) {
        callback(this);
        const { children } = this;
        for (let child of children) {
            if (child instanceof Group_js_1.Group) {
                child.traverse(callback);
            }
            else {
                callback(child);
            }
        }
    }
    /* 遍历可见元素 */
    traverseVisible(callback) {
        if (!this.visible) {
            return;
        }
        callback(this);
        const { children } = this;
        for (let child of children) {
            if (!child.visible) {
                continue;
            }
            if (child instanceof Group_js_1.Group) {
                child.traverse(callback);
            }
            else {
                callback(child);
            }
        }
    }
    /* 排序 */
    sort() {
        const { children } = this;
        children.sort((a, b) => {
            return a.index - b.index;
        });
        for (let child of children) {
            child instanceof Group_js_1.Group && child.sort();
        }
    }
    /* 删除元素 */
    remove(...objs) {
        const { children } = this;
        for (let obj of objs) {
            const index = children.indexOf(obj);
            if (index !== -1) {
                obj.parent = undefined;
                this.children.splice(index, 1);
                this.emit({ type: "remove", obj });
            }
            else {
                for (let child of children) {
                    if (child instanceof Group_js_1.Group) {
                        child.remove(obj);
                    }
                }
            }
        }
        return this;
    }
    /* 清空children */
    clear() {
        for (let obj of this.children) {
            obj.parent = undefined;
            this.emit({ type: "removed", obj });
        }
        this.children = [];
        return this;
    }
    /* 绘图 */
    drawShape(ctx) {
        const { children } = this;
        /* 绘制子对象 */
        for (let obj of children) {
            obj.draw(ctx);
        }
    }
}
exports.Scene = Scene;
