let {StrategyEnance} = require("../../commonjs_build/middleware/Strategy/StrategyEnance.js")

let res
let lk = new StrategyEnance()
let judge = (param1) => {
    if (param1 > 1000) {
        return "fly"
    }
    if (param1 < 30) {
        return "run"
    }
}
lk.EventBusSet({
    eventBus: {
        default: [() => {
            console.log("触发defalut")
        }], error: [() => {
            console.log("触发了error")
        }]
    }
})
lk.JudgeFnSet(judge)


describe('StrategyEnance', () => {

    // f1: 基础事件触发
    test('StrategyEnance/event', () => {
        lk.StrategyAdd("run", () => {
            expect(true).toBe(true);
        })
        lk.Execute(0)
    });  

   
})