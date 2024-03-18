type emitNameType = 'default' | "error";
type StrategyType = {
    eventBus?: {
        default: Array<Function>;
        error: Array<Function>;
    };
};
interface ObjectType {
    [key: string]: any;
}
/**
 * @des 要求用户的 action 方法传入
 */
declare class Strategy {
    MapHash: Map<string, Function>;
    config: StrategyType;
    constructor(config: StrategyType);
    /**
     * @des 重新排序
     */
    HashMapGen(HashKey: any): string;
    /**
     * @des 属性 和 方法
     * @param HashKey 属性object array数组
     * @param HashFn 方法
     */
    ActionAdd(HashKey: ObjectType, HashFn: Function): void;
    /**
   * @des 触发某一个事件
   * @param name
   * @param data 给function的值
   */
    emit: (name: emitNameType, data: any) => void;
    ActionExecute(HashKey: Record<string, any>, that?: any): void;
}
export { Strategy };
