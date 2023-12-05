type Handler<T = any> = (val: T) => void;
class EventBus<Events extends Record<string, any>> {
    private eventBus: any={};

    on<K extends keyof Events>(name: K, event: Handler<Events[K]>) {
        if (!this.eventBus[name]) {
            this.eventBus[name] = [event];
        } else {
            this.eventBus[name]!.push(event);
        }
    }

    emit<K extends keyof Events>(name: K, data: Events[K]) {
        if (this.eventBus[name]) {
            this.eventBus[name]!.forEach((handler: Function) => {
                // 在这里捕获并使用参数类型
                handler(data);
            });
        } else {
            throw new Error("没有这个事件");
        }
    }

    off<K extends keyof Events>(name: K) {
        delete this.eventBus[name];
    }
}


// let test = new EventBus<{"test1":any}>()
// test.emit("test1",45)
// test.on("test1",()=>{

// })

export {EventBus}


