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
// let test = new EventBus<"test1" | "ceshi">()
// test.emit("test1",45)
// test.on("test1",()=>{
// })
export { EventBus };
