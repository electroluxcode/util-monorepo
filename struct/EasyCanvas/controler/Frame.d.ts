import { Matrix3 } from '../math/Matrix3.js';
import { Vector2 } from '../math/Vector2.js';
import { Img2D } from '../objects/Img2D.js';
type Leve = 'moMatrix' | 'pvmoMatrix';
type FrameType = {
    img?: Img2D;
    level?: Leve;
};
export type State = 'scale' | 'scaleX' | 'scaleY' | 'rotate' | 'move' | null;
declare class Frame {
    _img: Img2D;
    vertives: number[];
    center: Vector2;
    matrix: Matrix3;
    level: string;
    opposite: Vector2;
    strokeStyle: string;
    fillStyle: string;
    constructor(attr?: FrameType);
    get img(): Img2D;
    set img(val: Img2D);
    updateShape(): void;
    getMouseState(mp: Vector2): State;
    /**
     * @des 重要:绘制 frmae
     */
    draw(ctx: CanvasRenderingContext2D): void;
}
export { Frame };
