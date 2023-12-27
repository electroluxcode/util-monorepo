import { Matrix3 } from '../math/Matrix3.js';
/**
 * @des 重要:绘制边界
 * 各个边界moveto lineto 后 closepath就好了,如果想要显示出来就需要 stroke
 */
declare function crtPathByMatrix(ctx: CanvasRenderingContext2D, vertices: number[], matrix: Matrix3, closePath?: boolean, isShow?: boolean, style?: {
    width: number;
    color: string;
}): void;
declare function ImagePromise(image: HTMLImageElement): Promise<HTMLImageElement>;
declare function crtPath(ctx: CanvasRenderingContext2D, vertices: number[], closePath?: boolean): void;
declare function ImagePromises(images: HTMLImageElement[]): Promise<HTMLImageElement>[];
export { crtPathByMatrix, ImagePromise, crtPath, ImagePromises };
