// 模拟 webpack 生命周期
class life {
    hooks;
    constructor() {
        this.hooks = {
            entryOption: [],
            run: [],
            done: [],
        };
    }
    register(hookKey, fn) {
        this.hooks[hookKey].push(fn);
    }
    async call(hookKey, that) {
        let length = this.hooks[hookKey].length;
        for (let i = 0; i < length; i++) {
            await this.hooks[hookKey][i].call(that);
        }
    }
}
/**
 * @des 这是使用方式 | 注意绑定的this 是自己框架里面的this，life只是一个方法
 */
// function run (this:testcase){
//     console.log("run:",this)
//     return "run"
// }
// function afterRun (this:testcase){
//     return new Promise((resolve)=>{
//         setTimeout(() => {
//             console.log("afterRun:",this)
//             resolve("afterRun")
//         }, 1000);
//     })
// }
// let life_case = new life()
// life_case.register("run",run)
// life_case.register("run",afterRun)
// class testcase{
//     testcasedata:any
//     constructor(){
//         this.testcasedata = "testcasedata"
//         console.log(this)
//         life_case.call("run",this)
//         // life_case.hooks.done.apply(this)
//     }
// }
// new testcase()
export default life;
