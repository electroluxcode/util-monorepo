import { Vector2 } from '../math/Vector2.js';
import { Object2D } from '../objects/Object2D.js';
import { Img2D } from '../objects/Img2D.js';
import { Matrix3 } from '../math/Matrix3.js';
import { ImgTransformer } from './ImgTransformer.js';
import { MouseShape } from './MouseShape.js';
import { Frame, State } from './Frame.js';
type ImgData = {
    position: Vector2;
    scale: Vector2;
    rotate: number;
    offset: Vector2;
};
type TransformStage = {
    clipCenter: Vector2;
    clipOpposite: Vector2;
    parentPvmInvert: Matrix3;
};
declare class ImgControler extends Object2D {
    _img: Img2D | null;
    frame: Frame;
    mouseState: State;
    readonly clipMousePos: Vector2;
    mouseShape: MouseShape;
    index: number;
    enableCamera: boolean;
    _controlState: State;
    _altKey: boolean;
    shiftKey: boolean;
    origin: Vector2;
    clipOrigin: Vector2;
    parentMousePos: Vector2;
    controlStage: ImgData;
    transformStage: TransformStage;
    imgTransformer: ImgTransformer;
    get img(): Img2D;
    set img(val: Img2D);
    get controlState(): State;
    set controlState(val: State);
    get altKey(): boolean;
    set altKey(val: boolean);
    saveTransformData(img: Img2D): void;
    setRotateOrigin(): void;
    setScaleOrigin(): void;
    offsetImgByOrigin(img: Img2D): void;
    /**
     * @des 监听鼠标选择了什么图片
     */
    pointerdown(img: Img2D | null, mp: Vector2): void;
    pointermove(mp: Vector2): void;
    pointerup(): void;
    keydown(key: string, altKey: boolean, shiftKey: boolean): void;
    keyup(altKey: boolean, shiftKey: boolean): void;
    updateLocalMousePos(): void;
    transformImg(): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
export { ImgControler };
