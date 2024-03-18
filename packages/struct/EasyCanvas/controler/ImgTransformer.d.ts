import { Vector2 } from '../math/Vector2.js';
import { Img2D } from '../objects/Img2D.js';
export type ImgData = {
    position: Vector2;
    scale: Vector2;
    rotate: number;
    offset: Vector2;
};
type ImgTransformerType = {
    img?: Img2D;
    orign?: Vector2;
    mousePos?: Vector2;
    mouseStart?: Vector2;
    uniformRotateAng?: number;
};
declare class ImgTransformer {
    img: Img2D;
    position: Vector2;
    scale: Vector2;
    rotate: number;
    offset: Vector2;
    orign: Vector2;
    mousePos: Vector2;
    mouseStart: Vector2;
    originToMouseStart: Vector2;
    uniformRotateAng: number;
    constructor(attr?: ImgTransformerType);
    setOption(attr?: ImgTransformerType): void;
    updateOriginToMouseStart(mouseStart?: Vector2, orign?: Vector2): void;
    passImgDataTo(obj?: ImgData): void;
    restoreImg(): void;
    copyImgData(obj: ImgData): void;
    scale0(): void;
    getLocalScale(): Vector2;
    scale1(): void;
    scaleX0(): void;
    scaleY0(): void;
    doScaleSigleDir(dir: 'x' | 'y'): void;
    scaleX1(): void;
    scaleY1(): void;
    doUniformScaleSigleDir(dir: 'x' | 'y'): void;
    rotate0(): void;
    rotate1(): void;
    move0(): void;
    move1(): void;
}
export { ImgTransformer };
