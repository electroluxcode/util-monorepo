import { Object2D, Object2DType } from "../core/Object2D.js";
import { Vector2 } from "../math/Vector2.js";
import { crtPathByMatrix } from "./ObjectUtils.js";

/* 构造参数的类型 */
type TextType = Object2DType & {
	width?: number | string;
	height?: number | string;
};

/* 文字对齐方式引起的偏移量 */

class Rect2D extends Object2D {
	width: number;
	height: number;
	color: string;
	constructor(attr: TextType = {}) {
		super();
		this.setOption(attr);
	}

	/* 属性设置 */
	setOption(attr: TextType) {
		for (let [key, val] of Object.entries(attr)) {
			if (key === "style") {
				this.style.setOption(val);
			} else {
				this[key] = val;
			}
		}
	}

	/* 文本尺寸 */
	get size(): Vector2 {
		return new Vector2(this.width, this.height);
	}

	/* 绘制图像边界 */
	crtPath(ctx: CanvasRenderingContext2D, matrix = this.pvmMatrix) {
		this.computeBoundingBox();
		const {
			boundingBox: {
				min: { x: x0, y: y0 },
				max: { x: x1, y: y1 },
			},
		} = this;
		crtPathByMatrix(ctx, [x0, y0, x1, y0, x1, y1, x0, y1], matrix);
	}

	/* 注意:计算边界盒子 */
	computeBoundingBox() {
		const {
			boundingBox: { min, max },
			size,
			offset,
		} = this;
		min.set(offset.x, offset.y);
		max.addVectors(min, size);
	}

	/* 绘图 */
	drawShape(ctx: CanvasRenderingContext2D) {
		const {
			boundingBox: { min, max },

			offset: { x, y },
		} = this;

		// 绘图

		ctx.fillStyle = this.color;
		ctx.fillRect(x, y, this.width, this.height);
		ctx.closePath();
	}
}

export { Rect2D };
