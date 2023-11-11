import { Vector2 } from '../math/Vector2'
import { Img } from '../objects/Img'

/* PI*2 */
const pi2 = Math.PI * 2

/* 图案数据类型 */
export type ImgData = {
	position: Vector2
	scale: Vector2
	rotate: number
	offset: Vector2
}

type ImgTransformerType = {
	img?: Img
	orign?: Vector2
	mousePos?: Vector2
	mouseStart?: Vector2
	uniformRotateAng?: number
}

class ImgTransformer {
	/* 变换图案 */
	img = new Img()

	/* 暂存图案的变换信息 */
	position = new Vector2()
	scale = new Vector2(1, 1)
	rotate = 0
	offset = new Vector2()

	/* 图案的变换基点 */
	orign = new Vector2()

	/* 图案父级坐标系里的鼠标数据 */
	// 鼠标位置
	mousePos = new Vector2()
	// 鼠标起始位
	mouseStart = new Vector2()
	// mouseStart减orign
	originToMouseStart = new Vector2()

	/* 等量旋转时的旋转弧度 */
	uniformRotateAng = pi2 / 24

	constructor(attr: ImgTransformerType = {}) {
		this.setOption(attr)
	}

	/* 设置属性 */
	setOption(attr: ImgTransformerType = {}) {
		Object.assign(this, attr)
		const { img, mouseStart, orign } = attr
		img && this.passImgDataTo()
		if (orign || mouseStart) {
			this.updateOriginToMouseStart(mouseStart, orign)
		}
	}

	/* 变换基点到鼠标起点的向量 */
	updateOriginToMouseStart(mouseStart = this.mouseStart, orign = this.orign) {
		this.originToMouseStart.subVectors(mouseStart, orign)
	}

	/* 把img变换数据传递给obj */
	passImgDataTo(obj: ImgData = this) {
		const { position, scale, rotate, offset } = this.img
		obj.position.copy(position)
		obj.scale.copy(scale)
		obj.rotate = rotate
		obj.offset.copy(offset)
	}

	/* 将图案回退到变换之前的状态 */
	restoreImg() {
		this.copyImgData(this)
	}

	// 将obj中的变换数据拷贝到img中
	copyImgData(obj: ImgData) {
		const { position, scale, rotate, offset } = obj
		const { img } = this
		img.position.copy(position)
		img.scale.copy(scale)
		img.rotate = rotate
		img.offset.copy(offset)
	}

	/* 双向缩放 */
	scale0() {
		const { img, scale } = this
		img.scale.copy(scale.clone().multiply(this.getLocalScale()))
	}

	/* 获取图案本地的缩放量 */
	getLocalScale() {
		const { img, orign, originToMouseStart, mousePos } = this
		const rotateInvert = -img.rotate
		return mousePos
			.clone()
			.sub(orign)
			.rotate(rotateInvert)
			.divide(originToMouseStart.clone().rotate(rotateInvert))
	}

	/* 双向等比缩放 */
	scale1() {
		const { img, scale } = this
		const s = this.getLocalScale()
		img.scale.copy(scale.clone().multiplyScalar((s.x + s.y) / 2))
	}

	/* 单向缩放 */
	scaleX0() {
		this.doScaleSigleDir('x')
	}
	scaleY0() {
		this.doScaleSigleDir('y')
	}

	doScaleSigleDir(dir: 'x' | 'y') {
		const { img, scale } = this
		const s = this.getLocalScale()
		img.scale[dir] = scale[dir] * s[dir]
	}

	/* 单向等比缩放 */
	scaleX1() {
		this.doUniformScaleSigleDir('x')
	}
	scaleY1() {
		this.doUniformScaleSigleDir('y')
	}

	doUniformScaleSigleDir(dir: 'x' | 'y') {
		const { img, scale } = this
		const s = this.getLocalScale()
		img.scale.copy(scale.clone().multiplyScalar(s[dir]))
	}

	/* 旋转 */
	rotate0() {
		const { img, rotate, orign, originToMouseStart, mousePos } = this
		img.rotate =
			rotate + mousePos.clone().sub(orign).angle() - originToMouseStart.angle()
	}

	/* 等量旋转 */
	rotate1() {
		const {
			img,
			rotate,
			orign,
			originToMouseStart,
			mousePos,
			uniformRotateAng,
		} = this
		const ang = mousePos.clone().sub(orign).angle() - originToMouseStart.angle()
		img.rotate =
			rotate +
			Math.floor((ang + uniformRotateAng / 2) / uniformRotateAng) *
				uniformRotateAng
	}

	/* 位移 */
	// 自由位移
	move0() {
		const { img, position, mouseStart, mousePos } = this
		img.position.copy(position.clone().add(mousePos.clone().sub(mouseStart)))
	}
	// 正交位移-作业，留给同学们实现
	move1() {}
}

export { ImgTransformer }
