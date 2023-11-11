import { Matrix3 } from '../math/Matrix3'
import { Vector2 } from '../math/Vector2'

class Camera {
	position: Vector2
	zoom: number

	constructor(x = 0, y = 0, zoom = 1) {
		this.position = new Vector2(x, y)
		this.zoom = zoom
	}
	/* 视图投影矩阵：先逆向缩放，再逆向位置 */
	get pvMatrix() {
		const {
			position: { x, y },
			zoom,
		} = this
		return new Matrix3().scale(1 / zoom).translate(-x, -y)
	}
	/* 使用视图投影矩阵反向变换物体*/
	transformInvert(ctx: CanvasRenderingContext2D) {
		const {
			position: { x, y },
			zoom,
		} = this
		const scale = 1 / zoom
		ctx.translate(-x, -y)
		ctx.scale(scale, scale)
	}
}
export { Camera }
