import { Vector2 } from '../math/Vector2'
import { Object2D, Object2DType } from '../objects/Object2D'
import { Img } from '../objects/Img'
import { Matrix3 } from '../math/Matrix3'
import { Scene } from '../core/Scene'
import { Frame, State } from './Frame'
import { MouseShape } from './MouseShape'
import { ImgTransformer, ImgData } from './ImgTransformer'

const _changeEvent = { type: 'change' }

/* 变换之前的暂存数据类型 */
type TransformStage = {
	clipCenter: Vector2
	clipOpposite: Vector2
	parentPvmInvert: Matrix3
}

class ImgControler extends Object2D {
	// 要控制的图片
	_img: Img | null = null
	// 图案控制框
	frame = new Frame()
	// 渲染顺序
	index = Infinity
	// 不受相机影响
	enableCamera = false

	// 鼠标状态
	mouseState: State = null

	// 鼠标的裁剪坐标位
	clipMousePos = new Vector2()

	// 鼠标图案
	mouseShape = new MouseShape({
		vertives: this.frame.vertives,
		center: this.frame.center,
		mousePos: this.clipMousePos,
	})

	// 控制状态
	_controlState: State = null
	// alt 键是否按下
	_altKey = false
	// shift 键是否按下
	shiftKey = false
	// 图案在父级坐标系内的变换基点
	origin = new Vector2()
	// 图案在裁剪坐标系内的变换基点
	clipOrigin = new Vector2()

	// 鼠标在图案父级坐标系内的坐标位
	parentMousePos = new Vector2()
	// 选中图案时的暂存数据，用于取消变换
	controlStage: ImgData = {
		position: new Vector2(),
		scale: new Vector2(1, 1),
		rotate: 0,
		offset: new Vector2(),
	}
	// 变换前的暂存数据，用于设置变换基点，将裁剪坐标转图案父级坐标
	transformStage: TransformStage = {
		clipCenter: new Vector2(),
		clipOpposite: new Vector2(),
		parentPvmInvert: new Matrix3(),
	}
	// 图案变换器
	imgTransformer = new ImgTransformer({
		mousePos: this.parentMousePos,
		orign: this.origin,
	})

	get img() {
		return this._img
	}
	set img(val) {
		if (this._img === val) {
			return
		}
		this._img = val
		if (val) {
			this.imgTransformer.setOption({ img: val })
			this.imgTransformer.passImgDataTo(this.controlStage)
			this.frame.img = val
			this.dispatchEvent({ type: 'selected', img: val })
		} else {
			this.mouseState = null
			this.controlState = null
		}
		this.dispatchEvent(_changeEvent)
	}

	get controlState() {
		return this._controlState
	}
	set controlState(val) {
		if (this._controlState === val) {
			return
		}
		this._controlState = val
		const { img } = this
		if (!val || !img) {
			return
		}
		// 暂存变换数据
		this.saveTransformData(img)
		if (val === 'move') {
			return
		}
		// 设置变换基点
		if (val === 'rotate') {
			this.setRotateOrigin()
		} else if (val?.includes('scale')) {
			this.setScaleOrigin()
		}
		// 在不改变图案世界位的前提下，基于变换基点，偏移图案
		this.offsetImgByOrigin(img)
	}

	get altKey() {
		return this._altKey
	}
	set altKey(val) {
		if (this._altKey === val) {
			return
		}
		this._altKey = val
		const { img, controlState, origin, imgTransformer } = this
		if (!img) {
			return
		}
		if (controlState?.includes('scale')) {
			// 将图案回退到变换之前的状态
			imgTransformer.restoreImg()
			// 根据alt键设置缩放基点
			this.setScaleOrigin()
			// 根据变换基点，偏移图案
			this.offsetImgByOrigin(img)
			// 变换图案
			this.transformImg()
		}
	}

	/* 暂存变换数据 */
	saveTransformData(img: Img) {
		const {
			clipMousePos,
			imgTransformer,
			frame,
			transformStage: { clipCenter, clipOpposite, parentPvmInvert },
		} = this
		const { parent } = img
		parent && parentPvmInvert.copy(parent.pvmMatrix.invert())
		clipCenter.copy(frame.center)
		clipOpposite.copy(frame.opposite)
		imgTransformer.setOption({
			img,
			mouseStart: clipMousePos.clone().applyMatrix3(parentPvmInvert),
		})
	}

	/* 设置缩放基点 */
	setScaleOrigin() {
		const {
			altKey,
			origin,
			imgTransformer,
			clipOrigin,
			transformStage: { clipCenter, clipOpposite, parentPvmInvert },
		} = this
		// 根据altKey，将图案中心点或对点从裁剪坐标系转图案父级坐标系
		if (altKey) {
			clipOrigin.copy(clipCenter)
			origin.copy(clipCenter.clone().applyMatrix3(parentPvmInvert))
		} else {
			clipOrigin.copy(clipOpposite)
			origin.copy(clipOpposite.clone().applyMatrix3(parentPvmInvert))
		}
		// 更新父级坐标系里基点到鼠标起点的向量
		imgTransformer.updateOriginToMouseStart()
	}

	/* 设置旋转基点 */
	setRotateOrigin() {
		const {
			origin,
			imgTransformer,
			clipOrigin,
			transformStage: { clipCenter, parentPvmInvert },
		} = this
		// 图案基点在裁剪坐标系中的位置
		clipOrigin.copy(clipCenter)
		// 将图案中心点从裁剪坐标系转父级坐标系
		origin.copy(clipCenter.clone().applyMatrix3(parentPvmInvert))
		// 更新父级坐标系里基点到鼠标起点的向量
		imgTransformer.updateOriginToMouseStart()
	}

	/* 基点变换 */
	offsetImgByOrigin(img: Img) {
		const { offset, position, scale, rotate, pvmMatrix } = img
		// 偏移量
		const curOffset = new Vector2().subVectors(
			offset,
			this.clipOrigin.clone().applyMatrix3(pvmMatrix.invert())
		)
		// 当前偏移和原有偏移的向量差
		const diff = new Vector2().subVectors(curOffset, offset)
		// 图案的offset需要基于curOffset 做反向偏移
		offset.copy(curOffset)
		// 上一级的position 再偏移回来，以确保图案的世界位不变
		position.sub(diff.multiply(scale).rotate(rotate))
	}

	/* 鼠标按下 */
	pointerdown(img: Img | null, mp: Vector2) {
		if (!this.mouseState) {
			this.img = img
			if (!this.img) {
				return
			}
		}
		// 更新鼠标裁剪坐标位
		this.clipMousePos.copy(mp)
		// 获取鼠标状态
		this.mouseState = this.frame.getMouseState(mp)
		if (this.mouseState) {
			// 控制状态等于鼠标状态
			this.controlState = this.mouseState
			// 更新鼠标父级位
			this.updateParentMousePos()
		}

		this.dispatchEvent(_changeEvent)
	}

	/* 键盘按下 */
	keydown(key: string, altKey: boolean, shiftKey: boolean) {
		this.shiftKey = shiftKey
		this.altKey = altKey
		if (this.img) {
			switch (key) {
				case 'Escape':
					// 将选中图案时存储的图案变换数据controlStage 拷贝到图案中
					this.imgTransformer.copyImgData(this.controlStage)
					// 图案置空
					this.img = null
					break
				case 'Enter':
					// 图案置空
					this.img = null
					break
				case 'Delete':
					// 将img从其所在的group中删除
					this.img.remove()
					// 图案置空
					this.img = null
					break
			}
		}
		this.dispatchEvent(_changeEvent)
	}

	/* 键盘抬起 */
	keyup(altKey: boolean, shiftKey: boolean) {
		this.shiftKey = shiftKey
		this.altKey = altKey
		this.dispatchEvent(_changeEvent)
	}

	/* 更新鼠标在图案父级坐标系中的位置 */
	updateParentMousePos() {
		const {
			clipMousePos,
			parentMousePos,
			transformStage: { parentPvmInvert },
		} = this
		parentMousePos.copy(clipMousePos.clone().applyMatrix3(parentPvmInvert))
	}

	/* 鼠标移动 */
	pointermove(mp: Vector2) {
		if (!this.img) {
			return
		}
		// 更新鼠标裁剪坐标位
		this.clipMousePos.copy(mp)
		if (this.controlState) {
			// 更新鼠标在图案父级坐标系中的位置
			this.updateParentMousePos()
			// 变换图案
			this.transformImg()
		} else {
			// 获取鼠标状态
			this.mouseState = this.frame.getMouseState(mp)
		}

		this.dispatchEvent(_changeEvent)
	}

	/* 鼠标抬起 */
	pointerup() {
		if (this.controlState) {
			this.controlState = null
			this.dispatchEvent(_changeEvent)
		}
	}

	/* 变换图案 */
	transformImg() {
		const { imgTransformer, controlState, shiftKey, img } = this
		controlState && imgTransformer[controlState + Number(shiftKey)]()
		this.dispatchEvent({ type: 'transformed', img })
	}

	/* 绘图 */
	draw(ctx: CanvasRenderingContext2D) {
		const { img } = this
		if (!img) {
			return
		}
		const { frame, mouseShape, mouseState } = this
		/* 绘制外框 */
		frame.draw(ctx)
		/* 绘制鼠标图案 */
		mouseShape.draw(ctx, mouseState)
	}
}
export { ImgControler }
