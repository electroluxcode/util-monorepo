class AbortRequest {
    list = new Map();
    create(key) {
        const controller = new AbortController();
        console.log("create(key):", key);
        if (this.list.has(key)) {
            // console.log("--Promise相同,直接中断之前的请求--", this.list);
            // this.list.get(key)?.abort();
            console.log("--Promise相同,直接中断之后的请求--", this.list);
            controller.abort();
        }
        else {
            console.log("--继续执行--");
            this.list.set(key, controller);
        }
        return controller.signal;
    }
    remove(key) {
        this.list.delete(key);
    }
}
export default AbortRequest;
