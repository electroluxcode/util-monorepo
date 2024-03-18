import { Matrix3 } from '../math/Matrix3.js';
import { Vector2 } from '../math/Vector2.js';
import { Img2D } from '../objects/Img2D.js';
type Leve = 'moMatrix' | 'pvmoMatrix';
type MyFrameType = {
    img?: Img2D;
    level?: Leve;
};
export type State = 'scale' | 'scaleX' | 'scaleY' | 'rotate' | 'move' | null;
declare class MyFrame {
    _img: Img2D;
    vertives: number[];
    center: Vector2;
    matrix: Matrix3;
    level: string;
    opposite: Vector2;
    strokeStyle: string;
    fillStyle: string;
    constructor(attr?: MyFrameType);
    get img(): Img2D;
    set img(val: Img2D);
    updateShape(): void;
    getMouseState(mp: Vector2): State;
    /**
     * @des 重要:绘制 fraae
     * @param ctx
     * @param isSingle 如果事单独使用需要手动 translate
     */
    draw(ctx: CanvasRenderingContext2D, isSingle?: boolean): void;
}
export { MyFrame };
