import { BasicStyle, BasicStyleType } from './BasicStyle.js';
type OrderType = 0 | 1;
type MethodsType = ['fill', 'stroke'] | ['stroke', 'fill'];
export type StandStyleType = {
    strokeStyle?: string | CanvasGradient | CanvasPattern | undefined;
    fillStyle?: string | CanvasGradient | CanvasPattern | undefined;
    lineWidth?: number;
    lineDash?: number[] | undefined;
    lineDashOffset?: number;
    lineCap?: CanvasLineCap;
    lineJoin?: CanvasLineJoin;
    miterLimit?: number;
    order?: OrderType;
} & BasicStyleType;
declare class StandStyle extends BasicStyle {
    strokeStyle: string | CanvasGradient | CanvasPattern | undefined;
    fillStyle: string | CanvasGradient | CanvasPattern | undefined;
    lineWidth: number;
    lineDash: number[] | undefined;
    lineDashOffset: number;
    lineCap: CanvasLineCap;
    lineJoin: CanvasLineJoin;
    miterLimit: number;
    order: OrderType;
    constructor(attr?: StandStyleType);
    setOption(attr?: StandStyleType): void;
    get drawOrder(): MethodsType;
    apply(ctx: CanvasRenderingContext2D): void;
}
export { StandStyle };
