export type BasicStyleType = {
    shadowColor?: string | undefined;
    shadowBlur?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    globalAlpha?: number | undefined;
    globalCompositeOperation?: GlobalCompositeOperation | undefined;
    clip?: boolean;
    filter?: any;
};
declare class BasicStyle {
    shadowColor: string | undefined;
    shadowBlur: number;
    shadowOffsetX: number;
    shadowOffsetY: number;
    globalAlpha: number | undefined;
    globalCompositeOperation: GlobalCompositeOperation | undefined;
    clip: boolean;
    filter: string;
    setOption(attr?: BasicStyleType): void;
    apply(ctx: CanvasRenderingContext2D): void;
}
export { BasicStyle };
