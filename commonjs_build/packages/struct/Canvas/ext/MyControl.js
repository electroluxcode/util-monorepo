"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImgControler = void 0;
const Vector2_1 = require("../math/Vector2");
const Object2D_1 = require("../objects/Object2D");
const Matrix3_1 = require("../math/Matrix3");
const MyTransformer_1 = require("./MyTransformer");
// change 事件
const _changeEvent = { type: 'change' };
class ImgControler extends Object2D_1.Object2D {
    // 控制状态
    _controlState = null;
    // alt 键是否按下
    _altKey = false;
    // shift 键是否按下
    shiftKey = false;
    // 图案在父级坐标系内的变换基点
    origin = new Vector2_1.Vector2();
    // 鼠标在图案父级坐标系内的坐标位
    parentMousePos = new Vector2_1.Vector2();
    // 选中图案时的暂存数据，用于取消变换
    controlStage = {
        position: new Vector2_1.Vector2(),
        scale: new Vector2_1.Vector2(1, 1),
        rotate: 0,
        offset: new Vector2_1.Vector2(),
    };
    // 变换前的暂存数据，用于设置变换基点，将裁剪坐标转图案父级坐标
    transformStage = {
        clipCenter: new Vector2_1.Vector2(),
        clipOpposite: new Vector2_1.Vector2(),
        parentPvmInvert: new Matrix3_1.Matrix3(),
    };
    // 图案变换器
    MyTransformer = new MyTransformer_1.MyTransformer({
        mousePos: this.parentMousePos,
        orign: this.origin,
    });
    get controlState() {
        return this._controlState;
    }
    set controlState(val) {
        if (this._controlState === val) {
            return;
        }
        this._controlState = val;
    }
    get altKey() {
        return this._altKey;
    }
    set altKey(val) {
        if (this._altKey === val) {
            return;
        }
        this._altKey = val;
    }
}
exports.ImgControler = ImgControler;
