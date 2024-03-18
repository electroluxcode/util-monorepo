import { Camera } from './Camera.js';
import { Group } from '../objects/Group.js';
import { Object2D } from '../objects/Object2D.js';
import { Vector2 } from '../math/Vector2.js';
import { Matrix3 } from '../math/Matrix3.js';
type SceneType = {
    canvas?: HTMLCanvasElement;
    camera?: Camera;
    autoClear?: boolean;
};
declare class Scene extends Group {
    _canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    camera: Camera;
    autoClear: boolean;
    readonly isScene = true;
    constructor(attr?: SceneType);
    get canvas(): HTMLCanvasElement;
    set canvas(value: HTMLCanvasElement);
    /**
     * @des 设置属性 和 add 图层后 把canvas 传递过去就可以了
     * canvas 被设置之后会自动触发 得到 ctx 的事件
     * @param attr
     */
    setOption(attr: SceneType): void;
    render(): void;
    /**
     * @des client坐标转canvas坐标 我们需要 鼠标位置 减去 canvas 这个 元素的 左边和上面的位置
     */
    clientToCanvas(clientX: number, clientY: number): Vector2;
    /**
     * @des canvas坐标转裁剪坐标(工具方法) 因为 在 render 的时候 我们会  偏移 到中间去
     */
    canvastoClip({ x, y }: Vector2): Vector2;
    /**
     * @des client坐标转裁剪坐标。一般是 做鼠标事件的时候用的，因此clientToClip 是后来调用的 向着左边平移 一半确实是正确的坐标系
     */
    clientToClip(clientX: number, clientY: number): Vector2;
    /**
     * @des 基于中心坐标系，判断某个点是否在图形内
     * 需要先绘制 边缘路径接下来再进行 判断  调用原生 的 isPointInPath 判断就可以了
     * isPointInPath(x,y) 面向的对象是路径，所以对文字、fillRect()、strokeRect()不好使，
     */
    isPointInObj(obj: Object2D, mp: Vector2, matrix?: Matrix3): boolean;
}
export { Scene };
