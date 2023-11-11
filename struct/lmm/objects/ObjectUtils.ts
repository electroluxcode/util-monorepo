import { Matrix3 } from '../math/Matrix3'
import { Vector2 } from '../math/Vector2'

function crtPathByMatrix(
	ctx: CanvasRenderingContext2D,
	vertices: number[],
	matrix: Matrix3,
	closePath = false
) {
	const p0 = new Vector2(vertices[0], vertices[1]).applyMatrix3(matrix)
	ctx.moveTo(p0.x, p0.y)
	for (let i = 2, len = vertices.length; i < len; i += 2) {
		const pn = new Vector2(vertices[i], vertices[i + 1]).applyMatrix3(matrix)
		ctx.lineTo(pn.x, pn.y)
	}
	closePath && ctx.closePath()
}
function ImagePromise(image: HTMLImageElement) {
	return new Promise<HTMLImageElement>((resolve) => {
		image.onload = () => {
			resolve(image)
		}
	})
}

/* 创建路径 */
function crtPath(
	ctx: CanvasRenderingContext2D,
	vertices: number[],
	closePath = false
) {
	const p0 = new Vector2(vertices[0], vertices[1])
	ctx.moveTo(p0.x, p0.y)
	for (let i = 2, len = vertices.length; i < len; i += 2) {
		const pn = new Vector2(vertices[i], vertices[i + 1])
		ctx.lineTo(pn.x, pn.y)
	}
	closePath && ctx.closePath()
}

function ImagePromises(images: HTMLImageElement[]) {
	return images.map((image) => ImagePromise(image))
}

export { crtPathByMatrix, ImagePromise, crtPath, ImagePromises }
