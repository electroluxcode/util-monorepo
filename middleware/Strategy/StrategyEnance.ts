


type StrategyEnanceType<t extends  ("default" | "error") & string > = {
    eventBus?: Record<t,Array<Function>>;
}
type DeepShowType<t> = {
    [k in keyof t] : DeepShowType<t[k]>
} & {}

/**
 * @des 要求用户的 action 方法传入
 */
class StrategyEnance<StrategyType extends string,JudgeType extends any,EventBusType extends ("default" | "error") & string>{
    private StrategyObject: Record<any,any>
    private JudgeFn:Function;
    private config: DeepShowType<StrategyEnanceType<EventBusType>>;
   
    constructor() {
        this.StrategyObject = {}
    }
   
    /**
     * @des 策略的添加
     */
    StrategyAdd<k extends  StrategyType>(StrategyName: k, HashFn: Function) {
        this.StrategyObject[StrategyName] = HashFn
    }
    /**
     * @des eventbus的 设置
     */
    EventBusSet(config: DeepShowType<StrategyEnanceType<EventBusType>>) {
        this.config = Object.assign({}, config)
    }
    /**
     * @des JudgeFn 的 设置
     */
    JudgeFnSet(config: Function) {
        this.JudgeFn = config
    }

    /**
   * @des 触发某一个事件
   */
    emit = (name: EventBusType, data: any) => {
        if (this.config.eventBus) {
            if (this.config.eventBus[name]) {
                (this.config.eventBus[name] as Array<Function>).forEach((element: Function) => {
                    element(data);
                });
            } else {
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
    Execute<k extends  EventBusType>(JudgeData: JudgeType, that?: any) {
        let StrategyName
        let StrategyFn
        try{
            StrategyName = this.JudgeFn(JudgeData)
        }catch{
            this.emit("error" as k,"utilmonorepo提示:judge判断报错")
            return
        }
        StrategyFn = this.StrategyObject[StrategyName]
        if (!this.StrategyObject[StrategyName]) {
            this.emit("default" as k , "utilmonorepo默认提示:似乎并没有")
            return
        }
        
        if (that) {
            StrategyFn.bind(that)
        }else{
            StrategyFn.bind(this)
        }
        try{
            StrategyFn()
        }catch{
            this.emit("error" as k,"utilmonorepo默认提示:报错示例")
        }
            
    }
}

// 策略判断(优化成单个function判断) 和 策略方法分离
// 可添加，可重写
// let judge = (param1)=>{
//     if(param1>1000){
//         return "fly"
//     }
//     if(param1<500){
//         return "run"
//     }
// }

// let lk = new StrategyEnance<"run" | "fly",{id:number},any>()
// lk.EventBusSet({
//     eventBus:{
//         default:[()=>{
//             console.log("触发defalut")
//         }],error:[()=>{
//             console.log("触发了error")
//         }]
//     }
// })
// lk.JudgeFnSet(judge)

// lk.StrategyAdd("fly",()=>{
//     console.log("触发了fly",)
// })
// lk.StrategyAdd("run",()=>{
//     console.log("触发了run",)
// })
// lk.Execute({
//     id:56
// })


export {
    StrategyEnance
}







