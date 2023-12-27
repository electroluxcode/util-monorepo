import { Matrix3 } from '../math/Matrix3.js';
import { Vector2 } from '../math/Vector2.js';
import { BasicStyle, BasicStyleType } from '../style/BasicStyle.js';
import { Object2D, Object2DType } from './Object2D.js';
type ImgType = Object2DType & {
    image?: CanvasImageSource;
    offset?: Vector2;
    size?: Vector2;
    view?: View | undefined;
    src?: string;
    style?: BasicStyleType;
};
type View = {
    x: number;
    y: number;
    width: number;
    height: number;
};
declare class Img2D extends Object2D {
    image: CanvasImageSource;
    offset: Vector2;
    size: Vector2;
    view: View | undefined;
    style: BasicStyle;
    readonly isImg = true;
    constructor(attr?: ImgType);
    setOption(attr: ImgType): void;
    get moMatrix(): Matrix3;
    computeBoundingBox(): void;
    get pvmoMatrix(): Matrix3;
    drawShape(ctx: CanvasRenderingContext2D): void;
    crtPath(ctx: CanvasRenderingContext2D, matrix?: Matrix3, isShow?: boolean, style?: {
        width: number;
        color: string;
    }): void;
}
export { Img2D };
