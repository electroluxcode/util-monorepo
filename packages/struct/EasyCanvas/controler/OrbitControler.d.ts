import { Vector2 } from '../math/Vector2.js';
import { EventDispatcher } from '../core/EventDispatcher.js';
import { Camera } from '../core/Camera.js';
type Stage = {
    cameraZoom: number;
    cameraPosition: Vector2;
    panStart: Vector2;
};
type Option = {
    camera?: Camera;
    enableZoom?: boolean;
    zoomSpeed?: number;
    enablePan?: boolean;
    panSpeed?: number;
};
declare class OrbitControler extends EventDispatcher {
    camera: Camera;
    enableZoom: boolean;
    zoomSpeed: number;
    enablePan: boolean;
    panSpeed: number;
    panning: boolean;
    stage: Stage;
    constructor(camera: Camera, option?: Option);
    setOption(option: Option): void;
    /**
     * @des 缩放
     * @param deltaY 鼠标状态 > 0 往上滑动  <0 向下活动
     */
    doScale(deltaY: number): void;
    pointerdown(cx: number, cy: number): void;
    pointerup(): void;
    pointermove(cx: number, cy: number): void;
}
export { OrbitControler };
