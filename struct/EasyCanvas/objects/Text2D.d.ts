import { Vector2 } from '../math/Vector2.js';
import { TextStyle, TextStyleType } from '../style/TextStyle.js';
import { Object2D, Object2DType } from './Object2D.js';
type TextType = Object2DType & {
    text?: string;
    maxWidth?: number | undefined;
    style?: TextStyleType;
};
declare class Text2D extends Object2D {
    text: string;
    maxWidth: number | undefined;
    style: TextStyle;
    readonly isText = true;
    constructor(attr?: TextType);
    setOption(attr: TextType): void;
    get size(): Vector2;
    crtPath(ctx: CanvasRenderingContext2D, matrix?: import("../math/Matrix3.js").Matrix3): void;
    computeBoundingBox(): void;
    drawShape(ctx: CanvasRenderingContext2D): void;
}
export { Text2D };
