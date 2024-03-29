"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrbitControler = void 0;
const Vector2_js_1 = require("../math/Vector2.js");
const EventDispatcher_js_1 = require("../core/EventDispatcher.js");
/* change 事件 */
const _changeEvent = { type: 'change' };
/* 相机轨道控制 */
class OrbitControler extends EventDispatcher_js_1.EventDispatcher {
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
        super();
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
}
exports.OrbitControler = OrbitControler;
