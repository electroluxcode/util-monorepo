declare global {
    interface Window {
        Cesium: any;
    }
}
type LifeCycleType = {
    status: 'LOADING' | 'FINISH';
    onMounted: () => void;
};
export declare class cesiumInit {
    private container;
    private LifeCycle;
    private ModelPosition;
    private PositionData;
    constructor(idName: any, initData?: {
        x: number;
        y: number;
        z: number;
    });
    /**
     * @feature 模型加载
     * @param type
     */
    initObject(type: 'osgb' | 'gltf' | "example", url?: string): Promise<void>;
    clickSearch(_viewer: any): void;
    /**
     * @feature feature:控制模型
     */
    objectMove(Type: 'gltf' | '3dtile', Mode?: 'absolute' | 'relative', DegreesType?: {
        x: number;
        y: number;
        z: number;
    }, config?: {
        scale: number;
        heading: number;
    }): void;
    /**
     * @des feature:视角的经纬度移动(绝对) | (相对)
     * @param DegreesType x y z
     */
    cameraMove(Mode?: 'absolute' | 'relative', DegreesType?: any, config?: {
        heading_toRadians: number;
        pitch_toRadians: number;
        isTrackModel: boolean;
    }): void;
    lifeCycleChange(arg: LifeCycleType): void;
    destroyedAll(): void;
    /**
     * @des -------工具方法世界坐标转经纬度---------
     */
    private Cartesian3_to_WGS84;
    private InitGltfModel;
    private initScene;
    private initLight;
}
export {};
