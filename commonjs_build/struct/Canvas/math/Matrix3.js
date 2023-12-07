"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matrix3 = void 0;
class Matrix3 {
    elements = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    set(n11, n12, n13, n21, n22, n23, n31, n32, n33) {
        const te = this.elements;
        te[0] = n11;
        te[1] = n21;
        te[2] = n31;
        te[3] = n12;
        te[4] = n22;
        te[5] = n32;
        te[6] = n13;
        te[7] = n23;
        te[8] = n33;
        return this;
    }
    copy(m) {
        const te = this.elements;
        const me = m.elements;
        te[0] = me[0];
        te[1] = me[1];
        te[2] = me[2];
        te[3] = me[3];
        te[4] = me[4];
        te[5] = me[5];
        te[6] = me[6];
        te[7] = me[7];
        te[8] = me[8];
        return this;
    }
    /**
     * @des 矩阵相乘
     */
    multiply(m) {
        return this.multiplyMatrices(this, m);
    }
    /**
     * @des 顺序相反的相乘
     */
    premultiply(m) {
        return this.multiplyMatrices(m, this);
    }
    /**
     * @des 矩阵相乘
     */
    multiplyMatrices(a, b) {
        const ae = a.elements;
        const be = b.elements;
        const te = this.elements;
        const a11 = ae[0], a12 = ae[3], a13 = ae[6];
        const a21 = ae[1], a22 = ae[4], a23 = ae[7];
        const a31 = ae[2], a32 = ae[5], a33 = ae[8];
        const b11 = be[0], b12 = be[3], b13 = be[6];
        const b21 = be[1], b22 = be[4], b23 = be[7];
        const b31 = be[2], b32 = be[5], b33 = be[8];
        te[0] = a11 * b11 + a12 * b21 + a13 * b31;
        te[3] = a11 * b12 + a12 * b22 + a13 * b32;
        te[6] = a11 * b13 + a12 * b23 + a13 * b33;
        te[1] = a21 * b11 + a22 * b21 + a23 * b31;
        te[4] = a21 * b12 + a22 * b22 + a23 * b32;
        te[7] = a21 * b13 + a22 * b23 + a23 * b33;
        te[2] = a31 * b11 + a32 * b21 + a33 * b31;
        te[5] = a31 * b12 + a32 * b22 + a33 * b32;
        te[8] = a31 * b13 + a32 * b23 + a33 * b33;
        return this;
    }
    multiplyScalar(s) {
        const te = this.elements;
        te[0] *= s;
        te[3] *= s;
        te[6] *= s;
        te[1] *= s;
        te[4] *= s;
        te[7] *= s;
        te[2] *= s;
        te[5] *= s;
        te[8] *= s;
        return this;
    }
    /**
     * @des 得到函数的行列式，主要 用来判断 是否需要反向缩放
     * const det = m.determinant()
        if (det < 0) {
            sx = -sx
        }
     */
    determinant() {
        const te = this.elements;
        const a = te[0], b = te[1], c = te[2], d = te[3], e = te[4], f = te[5], g = te[6], h = te[7], i = te[8];
        return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
    }
    /**
     * @des 逆矩阵
     * @returns 用处是可以撤销变化
     */
    invert() {
        const te = this.elements, n11 = te[0], n21 = te[1], n31 = te[2], n12 = te[3], n22 = te[4], n32 = te[5], n13 = te[6], n23 = te[7], n33 = te[8], t11 = n33 * n22 - n32 * n23, t12 = n32 * n13 - n33 * n12, t13 = n23 * n12 - n22 * n13, det = n11 * t11 + n21 * t12 + n31 * t13;
        if (det === 0)
            return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
        const detInv = 1 / det;
        te[0] = t11 * detInv;
        te[1] = (n31 * n23 - n33 * n21) * detInv;
        te[2] = (n32 * n21 - n31 * n22) * detInv;
        te[3] = t12 * detInv;
        te[4] = (n33 * n11 - n31 * n13) * detInv;
        te[5] = (n31 * n12 - n32 * n11) * detInv;
        te[6] = t13 * detInv;
        te[7] = (n21 * n13 - n23 * n11) * detInv;
        te[8] = (n22 * n11 - n21 * n12) * detInv;
        return this;
    }
    scale(sx, sy = sx) {
        this.premultiply(_m3.makeScale(sx, sy));
        return this;
    }
    rotate(theta) {
        this.premultiply(_m3.makeRotation(theta));
        return this;
    }
    /**
     * @des 平移矩阵
     */
    translate(tx, ty) {
        this.premultiply(_m3.makeTranslation(tx, ty));
        return this;
    }
    // for 2D Transforms
    makeTranslation(x, y) {
        this.set(1, 0, x, 0, 1, y, 0, 0, 1);
        return this;
    }
    makeRotation(theta) {
        // counterclockwise
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        this.set(c, -s, 0, s, c, 0, 0, 0, 1);
        return this;
    }
    makeScale(x, y) {
        this.set(x, 0, 0, 0, y, 0, 0, 0, 1);
        return this;
    }
    equals(matrix) {
        const te = this.elements;
        const me = matrix.elements;
        for (let i = 0; i < 9; i++) {
            if (te[i] !== me[i])
                return false;
        }
        return true;
    }
    fromArray(array, offset = 0) {
        for (let i = 0; i < 9; i++) {
            this.elements[i] = array[i + offset];
        }
        return this;
    }
    clone() {
        return new Matrix3().fromArray(this.elements);
    }
}
exports.Matrix3 = Matrix3;
const _m3 = new Matrix3();
