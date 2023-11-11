import { Camera } from './Camera'
import { Group } from '../objects/Group'
import { Object2D } from '../objects/Object2D'
import { Vector2 } from '../math/Vector2'
import { Matrix3 } from '../math/Matrix3'

type SceneType = {
	canvas?: HTMLCanvasElement
	camera?: Camera
	autoClear?: boolean
}

class Scene extends Group {
	// canvas画布
	_canvas = document.createElement('canvas')
	// canvas 上下文对象
	ctx: CanvasRenderingContext2D = this._canvas.getContext(
		'2d'
	) as CanvasRenderingContext2D
	// 相机
	camera = new Camera()
	// 是否自动清理画布
	autoClear = true
	// 类型
	readonly isScene = true

	constructor(attr: SceneType = {}) {
		super()
		this.setOption(attr)
	}
	get canvas() {
		return this._canvas
	}
	set canvas(value) {
		if (this._canvas === value) {
			return
		}
		this._canvas = value
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
	}
	/* 设置属性 */
	setOption(attr: SceneType) {
		for (let [key, val] of Object.entries(attr)) {
			this[key] = val
		}
	}

	/*  渲染 */
	render() {
		const {
			canvas: { width, height },
			ctx,
			camera,
			children,
			autoClear,
		} = this
		ctx.save()
		// 清理画布
		autoClear && ctx.clearRect(0, 0, width, height)
		// 裁剪坐标系：将canvas坐标系的原点移动到canvas画布中心
		ctx.translate(width / 2, height / 2)
		// 渲染子对象
		for (let obj of children) {
			ctx.save()
			// 视图投影矩阵
			obj.enableCamera && camera.transformInvert(ctx)
			// 绘图
			obj.draw(ctx)
			ctx.restore()
		}
		ctx.restore()
	}

	/* client坐标转canvas坐标 */
	clientToCanvas(clientX: number, clientY: number) {
		const { canvas } = this
		const { left, top } = canvas.getBoundingClientRect()
		return new Vector2(clientX - left, clientY - top)
	}

	/* canvas坐标转裁剪坐标 */
	canvastoClip({ x, y }: Vector2) {
		const {
			canvas: { width, height },
		} = this
		return new Vector2(x - width / 2, y - height / 2)
	}

	/* client坐标转裁剪坐标 */
	clientToClip(clientX: number, clientY: number) {
		return this.canvastoClip(this.clientToCanvas(clientX, clientY))
	}

	/* 基于某个坐标系，判断某个点是否在图形内 */
	isPointInObj(obj: Object2D, mp: Vector2, matrix: Matrix3 = new Matrix3()) {
		const { ctx } = this
		ctx.beginPath()
		obj.crtPath(ctx, matrix)
		return ctx.isPointInPath(mp.x, mp.y)
	}
}
export { Scene }
