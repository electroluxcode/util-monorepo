"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyEnance = void 0;
/**
 * @des 要求用户的 action 方法传入
 */
class StrategyEnance {
    StrategyObject;
    JudgeFn;
    config;
    constructor() {
        this.StrategyObject = {};
    }
    /**
     * @des 策略的添加
     */
    StrategyAdd(StrategyName, HashFn) {
        this.StrategyObject[StrategyName] = HashFn;
    }
    /**
     * @des eventbus的 设置
     */
    EventBusSet(config) {
        this.config = Object.assign({}, config);
    }
    /**
     * @des JudgeFn 的 设置
     */
    JudgeFnSet(config) {
        this.JudgeFn = config;
    }
    /**
   * @des 触发某一个事件
   */
    emit = (name, data) => {
        if (this.config.eventBus) {
            if (this.config.eventBus[name]) {
                this.config.eventBus[name].forEach((element) => {
                    element(data);
                });
            }
            else {
                throw new Error('utilmonorepo默认提示:没有这个事件');
            }
        }
    };
    /**
     *
     * @param JudgeData 判断的数据
     * @param that
     * @returns
     */
    Execute(JudgeData, that) {
        let StrategyName;
        let StrategyFn;
        try {
            StrategyName = this.JudgeFn(JudgeData);
        }
        catch {
            this.emit("error", "utilmonorepo提示:judge判断报错");
            return;
        }
        StrategyFn = this.StrategyObject[StrategyName];
        if (!this.StrategyObject[StrategyName]) {
            this.emit("default", "utilmonorepo默认提示:似乎并没有");
            return;
        }
        if (that) {
            StrategyFn.bind(that);
        }
        else {
            StrategyFn.bind(this);
        }
        try {
            StrategyFn();
        }
        catch {
            this.emit("error", "utilmonorepo默认提示:报错示例");
        }
    }
}
exports.StrategyEnance = StrategyEnance;
