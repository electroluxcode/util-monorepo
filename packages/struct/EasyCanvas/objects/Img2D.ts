import { Matrix3 } from "../math/Matrix3.js";
import { Vector2 } from "../math/Vector2.js";
import { BasicStyle, BasicStyleType } from "./BasicStyle.js";
import { Object2D, Object2DType } from "../core/Object2D.js";
import { crtPathByMatrix } from "./ObjectUtils.js";

export type ImgType = Object2DType & {
	image?: CanvasImageSource;
	offset?: Vector2;
	size?: Vector2;
	view?: View | undefined;
	src?: string;
	style?: BasicStyleType;
};

type View = {
	x: number;
	y: number;
	width: number;
	height: number;
};

class Img2D extends Object2D {
	image: CanvasImageSource = new Image();
	offset: Vector2 = new Vector2();
	size: Vector2 = new Vector2(300, 150);
	view: View | undefined;
	style: BasicStyle = new BasicStyle();

	// 类型
	readonly isImg = true;

	constructor(attr: ImgType = {}) {
		super();
		this.setOption(attr);
	}

	/* 属性设置 */
	setOption(attr: ImgType) {
		for (let [key, val] of Object.entries(attr)) {
			switch (key) {
				case "src":
					if (this.image instanceof Image) {
						this.image.src = val as "string";
					}
					break;
				case "style":
					this.style.setOption(val as BasicStyleType);
					break;
				default:
					this[key] = val;
			}
		}
	}

	/* 世界模型矩阵*偏移矩阵 */
	get moMatrix(): Matrix3 {
		const {
			offset: { x, y },
		} = this;
		return this.worldMatrix.multiply(new Matrix3().makeTranslation(x, y));
	}
	// 计算边界盒子，很牛皮
	computeBoundingBox() {
		const {
			boundingBox: { min, max },
			size,
			offset,
		} = this;
		min.copy(offset);
		max.addVectors(offset, size);
	}
	/* 视图投影矩阵*世界模型矩阵*偏移矩阵  */
	get pvmoMatrix(): Matrix3 {
		const {
			offset: { x, y },
		} = this;
		return this.pvmMatrix.multiply(new Matrix3().makeTranslation(x, y));
	}

	/* 绘图 */
	drawShape(ctx: CanvasRenderingContext2D) {
		const { image, offset, size, view, style } = this;

		//样式
		style.apply(ctx);

		// 绘制图像
		if (view) {
			ctx.drawImage(
				image,
				view.x,
				view.y,
				view.width,
				view.height,
				offset.x,
				offset.y,
				size.x,
				size.y
			);
		} else {
			ctx.drawImage(image, offset.x, offset.y, size.x, size.y);
		}
	}

	/* 绘制图像边界, */
	crtPath(
		ctx: CanvasRenderingContext2D,
		matrix = this.pvmoMatrix,
		isShow = false,
		style = { width: 5, color: "red" }
	) {
		const {
			size: { x: imgW, y: imgH },
		} = this;
		// 第二个参数是宽高 和周围的边界
		// 第三个参数是 默认是正方形,然后向着指定方向做位移
		crtPathByMatrix(
			ctx,
			[0, 0, imgW, 0, imgW, imgH, 0, imgH],
			matrix,
			true,
			isShow,
			style
		);

		// 第二种方式。因为这种方式没有计算移动到中间的坐标系，所以有问题
		// this.computeBoundingBox()
		// const {
		// 	boundingBox: {
		// 		min: { x: x0, y: y0 },
		// 		max: { x: x1, y: y1 },
		// 	},
		// } = this
		// // console.log("zptest:",this.boundingBox)
		// crtPathByMatrix(ctx, [x0+200, y0+200, x1+200, y0+200, x1+200, y1+200, x0+200, y1+200], matrix)
	}
}
export { Img2D };
