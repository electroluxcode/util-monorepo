import { Object2D, Object2DType } from './Object2D.js';
declare class Group extends Object2D {
    children: Object2D[];
    readonly isGroup = true;
    constructor(attr?: Object2DType);
    setOption(attr: Object2DType): void;
    add(...objs: Object2D[]): this;
    getObjectByName(name: string): Object2D;
    getObjectByProperty<T>(name: string, value: T): Object2D | undefined;
    traverse(callback: (obj: Object2D) => void): void;
    traverseVisible(callback: (obj: Object2D) => void): void;
    sort(): void;
    remove(...objs: Object2D[]): this;
    clear(): this;
    drawShape(ctx: CanvasRenderingContext2D): void;
}
export { Group };
