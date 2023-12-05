;
class EventBus {
    eventBus = {};
    on(name, event) {
        if (!this.eventBus[name]) {
            this.eventBus[name] = [event];
        }
        else {
            this.eventBus[name].push(event);
        }
    }
    emit(name, data) {
        if (this.eventBus[name]) {
            this.eventBus[name].forEach((handler) => {
                // 在这里捕获并使用参数类型
                handler(data);
            });
        }
        else {
            throw new Error("没有这个事件");
        }
    }
    off(name) {
        delete this.eventBus[name];
    }
}
// 使用示例
let eventbus1 = new EventBus();
let test34 = defineEmits("img", () => { console.log(); });
test34("");
// let test1 = (param: { id: number }) => {
//     console.log("这是test1:", param);
// };
// interface EventHandlers {
//     test2:typeof test1
//     // 添加其他事件的处理函数类型
// };
// eventbus1.on("test2", ({id})=>{});
// class a {
//     eventbus
//     constructor() {
//         this.eventbus=[]
//     }
//     add(fn: Function){
//         this.eventbus.add(fn as typeof fn)
//     }
// }
// let test12 = new a()
// let fn =( param: "level1" | "level2") => {
//     console.log(param)
// }
// let fn3 =( param: "level3" | "level4") => {
//     console.log(param)
// }
// test12.add(fn)
// test12.add(fn3)
// let cas =test12.eventbus[1]
// cas()
// 我想要在我调用cas的时候会有智能提示
