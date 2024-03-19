"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrbitControler = void 0;
const Vector2_js_1 = require("../math/Vector2.js");
/* change 事件 */
const _changeEvent = { type: 'change' };
/* 相机轨道控制 */
class OrbitControler {
    // 相机
    camera;
    // 允许缩放
    enableZoom = true;
    // 缩放速度
    zoomSpeed = 3.0;
    // 允许位移
    enablePan = true;
    // 位移速度
    panSpeed = 1.0;
    // 是否正在拖拽中
    panning = false;
    //变换相机前的暂存数据
    stage = {
        cameraZoom: 1,
        cameraPosition: new Vector2_js_1.Vector2(),
        panStart: new Vector2_js_1.Vector2(),
    };
    constructor(camera, option = {}) {
        this.camera = camera;
        this.setOption(option);
    }
    /* 设置属性 */
    setOption(option) {
        Object.assign(this, option);
    }
    /**
     * @des 缩放
     * @param deltaY 鼠标状态 > 0 往上滑动  <0 向下活动
     */
    doScale(deltaY) {
        const { enableZoom, camera, zoomSpeed, stage } = this;
        if (!enableZoom) {
            return;
        }
        // 回退可用
        stage.cameraZoom = camera.zoom;
        const scale = Math.pow(0.95, zoomSpeed);
        if (deltaY > 0) {
            camera.zoom /= scale;
        }
        else {
            camera.zoom *= scale;
        }
        this.emit(_changeEvent);
    }
    /* 鼠标按下 */
    pointerdown(cx, cy) {
        const { enablePan, stage: { cameraPosition, panStart }, camera: { position }, } = this;
        if (!enablePan) {
            return;
        }
        this.panning = true;
        // 复制 position 到 camera 中去
        cameraPosition.copy(position);
        panStart.set(cx, cy);
    }
    /* 鼠标抬起 */
    pointerup() {
        this.panning = false;
    }
    /* 位移 */
    pointermove(cx, cy) {
        const { enablePan, camera: { position }, stage: { panStart: { x, y }, cameraPosition, }, panning, } = this;
        if (!enablePan || !panning) {
            return;
        }
        // copy 就是让 后面的 等于 前面的
        position.copy(cameraPosition.clone().add(new Vector2_js_1.Vector2(x - cx, y - cy)));
        this.emit(_changeEvent);
    }
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
exports.OrbitControler = OrbitControler;
