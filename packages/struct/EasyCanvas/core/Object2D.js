import { Matrix3 } from '../math/Matrix3.js';
import { generateUUID } from '../math/MathUtils.js';
import { Vector2 } from '../math/Vector2.js';
const pi2 = Math.PI * 2;
class Object2D {
    // 位置
    position = new Vector2();
    // 旋转
    rotate = 0;
    // 缩放
    scale = new Vector2(1, 1);
    // 偏移（本地矩阵）
    offset = new Vector2();
    // 边界盒子（本地矩阵）
    boundingBox = {
        min: new Vector2(),
        max: new Vector2(),
    };
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
    uuid = generateUUID();
    // 类型
    isObject2D = true;
    /* 本地模型矩阵 */
    get matrix() {
        const { position, rotate, scale } = this;
        return new Matrix3().scale(scale.x, scale.y).rotate(rotate).translate(position.x, position.y);
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
            return new Matrix3().multiplyMatrices(camera.pvMatrix, this.worldMatrix);
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
    /* 将矩阵分解到当期对象的position, rotate, scale中 */
    decomposeModelMatrix(m) {
        const e = [...m.elements];
        // 位移量
        this.position.set(e[6], e[7]);
        // 缩放量
        let sx = new Vector2(e[0], e[1]).length();
        const sy = new Vector2(e[3], e[4]).length();
        const det = m.determinant();
        if (det < 0) {
            sx = -sx;
        }
        this.scale.set(sx, sy);
        // 旋转量
        let ang = Math.atan2(e[1] / sx, e[0] / sx);
        if (ang < 0) {
            ang += pi2;
        }
        this.rotate = ang;
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
    crtPath(ctx, projectionMatrix, isShow) { }
    /* 计算边界盒子-接口 */
    computeBoundingBox() { }
    _listeners = {};
    /* 监听事件 */
    on(type, listener) {
        const listeners = this._listeners;
        if (listeners[type] === undefined) {
            listeners[type] = [];
        }
        if (listeners[type].indexOf(listener) === -1) {
            listeners[type].push(listener);
        }
    }
    /* 判断目标对象的某个状态是否被某个监听器监听 */
    hasEmit(type, listener) {
        const listeners = this._listeners;
        return listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1;
    }
    /* 取消事件监听 */
    removeEmit(type, listener) {
        const listeners = this._listeners;
        const listenerArray = listeners[type];
        if (listenerArray !== undefined) {
            const index = listenerArray.indexOf(listener);
            if (index !== -1) {
                listenerArray.splice(index, 1);
            }
        }
    }
    /* 触发事件 */
    emit(event) {
        const listeners = this._listeners;
        const listenerArray = listeners[event.type];
        if (listenerArray !== undefined) {
            event.target = this;
            // 复制一份侦听器集合，以防在迭代时删除侦听器。
            const array = [...listenerArray];
            for (let i = 0, l = array.length; i < l; i++) {
                array[i].call(this, event);
            }
            event.target = null;
        }
    }
}
export { Object2D };
