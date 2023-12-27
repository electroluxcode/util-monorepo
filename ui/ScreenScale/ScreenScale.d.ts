interface Base {
    dw?: number;
    dh?: number;
    el?: string;
    resize?: boolean;
    ignore?: string[];
    transition?: string;
    delay?: number;
    isKeepRadio?: boolean;
}
declare class ScreenScale {
    private CurrelFixMap;
    private CurrelFixMapLevel;
    private resizeListener;
    private timer;
    private currScale;
    private isScreenScaleRunning;
    private IsMapElement;
    private currelRectificationIsKeepRatio;
    options: Base;
    /**
     * 初始化 ScreenScale 类。
     * @param options - ScreenScale 的配置选项。
     * @param isShowInitTip - 是否显示初始化消息（默认为 true）。
     */
    init(options?: Base, isShowInitTip?: boolean): void;
    /**
     * @des 解决事件偏移
     */
    FixMap(el?: string[], isKeepRatio?: boolean, level?: number): void;
    /**
     * @des 调整大小 | 自适应最小的 边长
     */
    private KeepFit;
}
export { ScreenScale };
export default ScreenScale;
