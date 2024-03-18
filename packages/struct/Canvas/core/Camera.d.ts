import { Matrix3 } from '../math/Matrix3.js';
import { Vector2 } from '../math/Vector2.js';
declare class Camera {
    position: Vector2;
    zoom: number;
    /**
     *
     * @param x
     * @param y
     * @param zoom ju
     */
    constructor(x?: number, y?: number, zoom?: number);
    get pvMatrix(): Matrix3;
    transformInvert(ctx: CanvasRenderingContext2D): void;
}
export { Camera };
