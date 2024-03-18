import { Vector2 } from '../math/Vector2.js';
import { Object2D } from '../objects/Object2D.js';
type MyShapeType = {
    fillStyle?: string;
    strokeStyle?: string;
    mousePos?: Vector2;
    center?: Vector2;
    vertives?: number[];
    moveVertices?: number[];
    rotateVertices?: number[];
    scaleVertices?: number[];
};
declare class MyShape extends Object2D {
    mousePos: Vector2;
    center: Vector2;
    vertives: number[];
    moveVertices: number[];
    roVertices: any[];
    fillStyle: string;
    strokeStyle: string;
    constructor(attr?: MyShapeType);
    move(ctx: CanvasRenderingContext2D): void;
    drawShape(ctx: CanvasRenderingContext2D): void;
}
export { MyShape };
