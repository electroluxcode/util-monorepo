type emitNameType = 'finish' | 'error';
type PoolRequestType = {
    eventBus?: {
        finish: Array<Function>;
        error: Array<Function>;
    };
    MaxRetryCount: number;
    RetryFn: (arg: any) => void;
    MaxConcurrentCount: number;
    ConcurrentFn: (arg: any) => void;
    PromiseArr: Array<(e?: any) => Promise<any>>;
    FailTask: Array<(e?: any) => Promise<any>>;
};
declare class Pool {
    /**
     * @des 并发池 | 最大并发量 | 请求参数之类的
     */
    config: PoolRequestType;
    paused: boolean;
    constructor(param: PoolRequestType);
    /**
     * @des 实现任务队列的暂停恢复
     */
    pauseIfNeeded(): Promise<void>;
    pauseStatus(pause: boolean): void;
    /**
     * @des 执行
     * @param PromiseArr promise数组
     * @param ParamArr 参数数组
     * @param Retry 重试次数
     */
    execute(PromiseArr: Array<(e?: any) => Promise<any>>, Concurrent: number, Retry: number): Promise<void>;
    /**
   * @des 触发某一个事件
   * @param name
   * @param data 给function的值
   */
    emit: (name: emitNameType, data: any) => void;
}
export { Pool };
