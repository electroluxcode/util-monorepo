declare class Matrix3 {
    elements: number[];
    set(n11: number, n12: number, n13: number, n21: number, n22: number, n23: number, n31: number, n32: number, n33: number): this;
    copy(m: Matrix3): this;
    /**
     * @des 矩阵相乘
     */
    multiply(m: Matrix3): this;
    /**
     * @des 顺序相反的相乘
     */
    premultiply(m: Matrix3): this;
    /**
     * @des 矩阵相乘
     */
    multiplyMatrices(a: Matrix3, b: Matrix3): this;
    multiplyScalar(s: number): this;
    /**
     * @des 得到函数的行列式，主要 用来判断 是否需要反向缩放
     * const det = m.determinant()
        if (det < 0) {
            sx = -sx
        }
     */
    determinant(): number;
    /**
     * @des 逆矩阵
     * @returns 用处是可以撤销变化
     */
    invert(): this;
    scale(sx: number, sy?: number): this;
    rotate(theta: number): this;
    /**
     * @des 平移矩阵
     */
    translate(tx: number, ty: number): this;
    makeTranslation(x: number, y: number): this;
    makeRotation(theta: number): this;
    makeScale(x: number, y: number): this;
    equals(matrix: Matrix3): boolean;
    fromArray(array: number[], offset?: number): this;
    clone(): Matrix3;
}
export { Matrix3 };
