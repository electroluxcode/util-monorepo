type OrderResult = 'chainNext' | any;
type OrderHandler = (...args: any[]) => OrderResult;
type emitNameType = 'finish' | 'error';
type ChainDataType = {
    eventBus?: {
        finish: Array<Function>;
        error: Array<Function>;
    };
    [key: string]: any;
};
/**
 * @des 链式调用数据
 */
declare class Chain {
    private fn;
    private nodeNext;
    ChainData: ChainDataType;
    constructor(fn: OrderHandler);
    /**
     * @des 触发某一个事件
     * @param name
     * @param data 给function的值
     */
    emit: (name: emitNameType, data: any) => void;
    /**
     * @des 初始化数据
     * @param data
     */
    dataSet(data: ChainDataType): void;
    /**
     * @des 异步进入下一个链条
     * @param args
     * @returns
     */
    asyncNext(): OrderResult;
    nodeSet(nodeNext: Chain): void;
    passRequest(): OrderResult;
}
export interface ExtendedChainData extends Chain {
    ChainData: {
        init: {
            xml_id: number;
            model_id: number;
        };
        res: any;
    };
}
export { Chain };
