import { Vector2 } from '../math/Vector2';
import { Object2D } from '../objects/Object2D';
import { Matrix3 } from '../math/Matrix3';
import { MyTransformer } from './MyTransformer';
import { State } from './MyFrame';
type TransformStage = {
    clipCenter: Vector2;
    clipOpposite: Vector2;
    parentPvmInvert: Matrix3;
};
declare class ImgControler extends Object2D {
    _controlState: State;
    _altKey: boolean;
    shiftKey: boolean;
    origin: Vector2;
    parentMousePos: Vector2;
    controlStage: {
        position: Vector2;
        scale: Vector2;
        rotate: number;
        offset: Vector2;
    };
    transformStage: TransformStage;
    MyTransformer: MyTransformer;
    get controlState(): State;
    set controlState(val: State);
    get altKey(): boolean;
    set altKey(val: boolean);
}
export { ImgControler };
