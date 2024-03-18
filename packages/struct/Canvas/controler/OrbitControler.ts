import { Vector2 } from '../math/Vector2.js'
import { EventDispatcher } from '../core/EventDispatcher.js'
import { Camera } from '../core/Camera.js'

/* 暂存数据类型 */
type Stage = {
	cameraZoom: number
	cameraPosition: Vector2
	// 拖拽起始位
	panStart: Vector2
}

/* 配置项 */
type Option = {
	camera?: Camera
	enableZoom?: boolean
	zoomSpeed?: number
	enablePan?: boolean
	// 平移速度
	panSpeed?: number
}

/* change 事件 */
const _changeEvent = { type: 'change' }

/* 相机轨道控制 */
class OrbitControler extends EventDispatcher {
	// 相机
	camera: Camera
	// 允许缩放
	enableZoom = true
	// 缩放速度
	zoomSpeed = 3.0

	// 允许位移
	enablePan = true
	// 位移速度
	panSpeed = 1.0

	// 是否正在拖拽中
	panning = false

	//变换相机前的暂存数据
	stage: Stage = {
		cameraZoom: 1,
		cameraPosition: new Vector2(),
		panStart: new Vector2(),
	}

	constructor(camera: Camera, option: Option = {}) {
		super()
		this.camera = camera
		this.setOption(option)
	}

	/* 设置属性 */
	setOption(option: Option) {
		Object.assign(this, option)
	}

	/**
	 * @des 缩放
	 * @param deltaY 鼠标状态 > 0 往上滑动  <0 向下活动
	 */
	doScale(deltaY: number) {
		const { enableZoom, camera, zoomSpeed, stage } = this
		if (!enableZoom) {
			return
		}
		// 回退可用
		stage.cameraZoom = camera.zoom
		const scale = Math.pow(0.95, zoomSpeed)
		if (deltaY > 0) {
			camera.zoom /= scale
		} else {
			camera.zoom *= scale
		}
		this.emit(_changeEvent)
	}

	/* 鼠标按下 */
	pointerdown(cx: number, cy: number) {
		const {
			enablePan,
			stage: { cameraPosition, panStart },
			camera: { position },
		} = this
		if (!enablePan) {
			return
		}
		this.panning = true
		// 复制 position 到 camera 中去
		cameraPosition.copy(position)
		panStart.set(cx, cy)
	}

	/* 鼠标抬起 */
	pointerup() {
		this.panning = false
	}

	/* 位移 */
	pointermove(cx: number, cy: number) {
		const {
			enablePan,
			camera: { position },
			stage: {
				panStart: { x, y },
				cameraPosition,
			},
			panning,
		} = this
		if (!enablePan || !panning) {
			return
		}
		// copy 就是让 后面的 等于 前面的 
		position.copy(cameraPosition.clone().add(new Vector2(x - cx, y - cy)))
		this.emit(_changeEvent)
	}
}
export { OrbitControler }
