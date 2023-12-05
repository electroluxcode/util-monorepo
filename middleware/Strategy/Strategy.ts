
type emitNameType = 'default' | "error";

type StrategyType = {
    // eventbus 
    eventBus?: {
        default: Array<Function>,
        error: Array<Function>
    };
}
interface ObjectType {
    [key: string]: any
}
/**
 * @des 要求用户的 action 方法传入
 */
class Strategy {
    MapHash: Map<string, Function>
    config: StrategyType;
    constructor(config: StrategyType) {
        this.config = Object.assign({}, config)
        this.MapHash = new Map()
    }
    /**
     * @des 重新排序
     */
    HashMapGen(HashKey){
        const orderedMap = new Map();
        const sortedKeys = Object.keys(HashKey).sort();
        // 整体的key，局部的key-value
        for (const key of sortedKeys) {
            orderedMap.set(HashKey[key], HashKey[key]);
        }
        return JSON.stringify(Object.fromEntries(orderedMap))
    }
    /**
     * @des 属性 和 方法
     * @param HashKey 属性object array数组
     * @param HashFn 方法
     */
    ActionAdd(HashKey: ObjectType, HashFn: Function) {
       
        let Key = this.HashMapGen(HashKey)
        this.MapHash.set(Key, HashFn)
    }
    /**
   * @des 触发某一个事件
   * @param name
   * @param data 给function的值
   */
    emit = (name: emitNameType, data: any) => {
        if (this.config.eventBus) {
            if (this.config.eventBus[name]) {
                this.config.eventBus[name].forEach((element: Function) => {
                    element(data);
                });
            } else {
                throw new Error('utilmonorepo默认提示:没有这个事件');
            }
        }
    };
    ActionExecute(HashKey: Record<string, any>, that?: any) {
        let Key = this.HashMapGen(HashKey)
        if (!this.MapHash.get(Key)) {
            this.emit("default", "utilmonorepo默认提示:触发默认方法")
            return
        }
        let Fn = this.MapHash.get(Key)!
        if (that) {
            Fn.bind(that)
        }else{
            Fn.bind(this)
        }
        try{
            Fn()
        }catch{
            this.emit("error","utilmonorepo默认提示:报错示例")
        }
            
    }
}

class A<T extends any> {
    eventbus: ((param: T) => void)[] = [];

    constructor(fn?: (param: T) => void) {
        if(fn){
            this.eventbus.push(fn);
        }
       
    }
}

let test = new A((param:"obj" | "model") => {
    console.log(param);
});

test.eventbus[0]; // 在这里会有智能提示


class MyStrategy extends Strategy{

}

// let Age20_SchoolA_RegionCN = { age: 20, school: "A", region: "cn" };

// let res2 = new Strategy({
//     eventBus: {
//         default: [(e) => {
//             console.log("触发默认方法:", e)
//         }],error:[(e) => {
//             console.log("触发报错:", e)
//         }]
//     }
// })

// let fn = (...arg)=>{
//     console.log(...arg)
// }
// fn({
//     id:2
// })
// res2.ActionAdd(fn, function (workHours) {
//     console.log("高");
//     throw new Error("报错")
//     return workHours * 25;
// });
export {
    Strategy
}







