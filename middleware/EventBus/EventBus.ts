
class EventBus<Events extends string> {
    private eventBus: any={};

    on<K extends  Events>(name: K, event: Function) {
        if (!this.eventBus[name]) {
            this.eventBus[name] = [event];
        } else {
            this.eventBus[name]!.push(event);
        }
    }

    emit<K extends  Events>(name: K, data: any) {
        if (this.eventBus[name]) {
            this.eventBus[name]!.forEach((handler: Function) => {
                // 在这里捕获并使用参数类型
                handler(data);
            });
        } else {
            throw new Error("没有这个事件");
        }
    }

    off<K extends Events>(name: K) {
        delete this.eventBus[name];
    }
}


// let test = new EventBus<"test1" | "ceshi">()
// test.emit("test1",45)
// test.on("test1",()=>{

// })

export {EventBus}


