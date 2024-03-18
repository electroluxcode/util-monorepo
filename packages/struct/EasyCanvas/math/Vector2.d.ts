import { Matrix3 } from './Matrix3.js';
declare class Vector2 {
    x: number;
    y: number;
    readonly isVector2 = true;
    constructor(x?: number, y?: number);
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    set(x: number, y?: number): this;
    setScalar(scalar: number): this;
    setX(x: number): this;
    setY(y: number): this;
    setComponent(index: number, value: number): this;
    getComponent(index: number): number;
    clone(): Vector2;
    copy(v: Vector2): this;
    add(v: Vector2): this;
    addScalar(s: number): this;
    addVectors(a: Vector2, b: Vector2): this;
    addScaledVector(v: Vector2, s: number): this;
    sub(v: Vector2): this;
    subScalar(s: number): this;
    subVectors(a: Vector2, b: Vector2): this;
    multiply(v: Vector2): this;
    multiplyScalar(scalar: number): this;
    divide(v: Vector2): this;
    divideScalar(scalar: number): this;
    min(v: Vector2): this;
    max(v: Vector2): this;
    clamp(min: Vector2, max: Vector2): this;
    clampScalar(minVal: number, maxVal: number): this;
    clampLength(min: number, max: number): this;
    floor(): this;
    ceil(): this;
    round(): this;
    roundToZero(): this;
    negate(): this;
    dot(v: Vector2): number;
    cross(v: Vector2): number;
    lengthSq(): number;
    length(): number;
    manhattanLength(): number;
    normalize(): this;
    angle(): number;
    distanceTo(v: Vector2): number;
    distanceToSquared(v: Vector2): number;
    manhattanDistanceTo(v: Vector2): number;
    setLength(length: number): this;
    lerp(v: Vector2, alpha: number): this;
    lerpVectors(v1: Vector2, v2: Vector2, alpha: number): this;
    equals(v: Vector2): boolean;
    fromArray(array: number[], offset?: number): this;
    toArray(array: number[], offset?: number): number[];
    rotate(angle: number): this;
    rotateAround(center: Vector2, angle: number): this;
    random(): this;
    lookAt(v: Vector2): number;
    /**
     * @des 将一个3维 坐标 变成 2维
     */
    applyMatrix3(m: Matrix3): this;
    /**
     * @des 这个方法可以学一下
     */
    [Symbol.iterator](): Generator<number, void, unknown>;
}
export { Vector2 };
