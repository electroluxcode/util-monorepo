import { Vector2 } from '../math/Vector2'
import { Object2D, Object2DType } from '../objects/Object2D'
import { Img2D } from '../objects/Img2D.js'
import { Matrix3 } from '../math/Matrix3'
import { Scene } from '../core/Scene'
import { MyTransformer } from './MyTransformer'
import {MyShape } from './MyShape.js'
import { MyFrame, State } from './MyFrame'

// change 事件
const _changeEvent = { type: 'change' }

/* 变换之前的暂存数据类型 */
type TransformStage = {
    clipCenter: Vector2
    clipOpposite: Vector2
        parentPvmInvert: Matrix3
}

class ImgControler extends Object2D {

    // 控制状态
    _controlState: State = null
    // alt 键是否按下
    _altKey = false
    // shift 键是否按下
    shiftKey = false
    // 图案在父级坐标系内的变换基点
    origin = new Vector2()
    // 鼠标在图案父级坐标系内的坐标位
    parentMousePos = new Vector2()
    // 选中图案时的暂存数据，用于取消变换
    controlStage = {
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
    MyTransformer = new MyTransformer({
        mousePos: this.parentMousePos,
        orign: this.origin,
    })
    
    get controlState() {
        return this._controlState
    }
    set controlState(val) {
        if (this._controlState === val) {
            return
        }
        this._controlState = val
    }
    
    get altKey() {
        return this._altKey
    }
    set altKey(val) {
        if (this._altKey === val) {
            return
        }
        this._altKey = val
    }

    
}

export { ImgControler }
