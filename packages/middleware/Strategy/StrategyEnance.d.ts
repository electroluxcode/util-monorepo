type StrategyEnanceType<t extends ("default" | "error") & string> = {
    eventBus?: Record<t, Array<Function>>;
};
type DeepShowType<t> = {
    [k in keyof t]: DeepShowType<t[k]>;
} & {};
/**
 * @des 要求用户的 action 方法传入
 */
declare class StrategyEnance<StrategyType extends string, JudgeType extends any, EventBusType extends ("default" | "error") & string> {
    private StrategyObject;
    private JudgeFn;
    private config;
    constructor();
    /**
     * @des 策略的添加
     */
    StrategyAdd<k extends StrategyType>(StrategyName: k, HashFn: Function): void;
    /**
     * @des eventbus的 设置
     */
    EventBusSet(config: DeepShowType<StrategyEnanceType<EventBusType>>): void;
    /**
     * @des JudgeFn 的 设置
     */
    JudgeFnSet(config: Function): void;
    /**
   * @des 触发某一个事件
   */
    emit: (name: EventBusType, data: any) => void;
    /**
     *
     * @param JudgeData 判断的数据
     * @param that
     * @returns
     */
    Execute<k extends EventBusType>(JudgeData: JudgeType, that?: any): void;
}
export { StrategyEnance };
