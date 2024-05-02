let sleep = () => {
    return new Promise((re) => {
        setTimeout(() => {
            re(100000);
        }, 2000);
    });
};
class StateMachine {
    data;
    isFinal;
    length = 0;
    dfsExeLength = 0;
    input;
    constructor(data) {
        this.data = data;
    }
    treeToArr(tree) {
        let treeArr = {};
        for (let i in tree) {
            this.length++;
            treeArr[tree[i].name] = tree[i];
            if (tree[i].children) {
                treeArr[tree[i].name].newChildren = this.treeToArr(treeArr[tree[i].name].children);
            }
        }
        return treeArr;
    }
    setInput(input) {
        this.input = input;
    }
    isState() { }
    exexcte() {
        let newObj = this.treeToArr(this.data.states);
        if (!this.data["inital"] || !newObj[this.data["inital"]]) {
            throw Error("并没有定义inital或者并没有相对应的state");
        }
        // this.dfsExe([newObj[this.data["inital"]]]);
        this.dfsExe(this.data.states);
    }
    async dfsExe(arr) {
        if (this.isFinal) {
            return;
        }
        for (let i = 0; i < arr.length; i++) {
            // 判断是否满足守卫条件
            let isNext;
            // 不传入guard默认放行 + 判断是否promise
            if (!arr[i].guard) {
            }
            else {
                isNext = arr[i].guard({ input: this.input });
            }
            if (typeof isNext == "object" && isNext.then) {
                isNext = await isNext;
            }
            // 满足守卫并且是最终节点
            if (isNext && arr[i].type == "final") {
                this.isFinal = true;
                arr[i].fn();
                this.data["nowState"] = arr[i].name;
                return;
            }
            // 满足守卫并且还有children
            if (isNext && arr[i].children) {
                this.data["nowState"] = arr[i].name;
                await this.dfsExe(arr[i].children);
            }
            // 不满足 return 就退出
            if (!isNext) {
            }
            // 兜底，但是如果遇到type是final节点不会触发
            this.dfsExeLength++;
            if (this.length == this.dfsExeLength) {
                console.log("遍历完所有选项");
            }
        }
    }
}
let data = {
    id: "",
    inital: "pendingState",
    nowState: "",
    states: [
        {
            id: 1,
            name: "pendingState",
            meta: ({ input, context }) => { },
            guard: ({ input, context }) => {
                console.log("pending的守卫");
                return typeof input.id == "number";
            },
            children: [
                // 同步异步也好像需要考虑
                {
                    id: 2,
                    guard: ({ meta, input }) => {
                        if (input.id > 100) {
                            console.log("大于100");
                            console.log("resolved的守卫");
                            return true;
                        }
                    },
                    fn: () => {
                        console.log("大于100:", "--resolve--");
                    },
                    name: "resolvedState",
                    type: "final",
                    parentId: 1,
                },
                {
                    id: 3,
                    name: "rejectedState",
                    guard: async ({ meta, input }) => {
                        await sleep();
                        if (input.id < 100) {
                            console.log("reject的守卫");
                            return true;
                        }
                    },
                    fn: () => {
                        console.log("小于100:", "--reject--");
                    },
                    type: "final",
                    parentId: 1,
                },
            ],
        },
        {
            id: 1,
            name: "pendingSex",
            meta: ({ input, context }) => { },
            guard: ({ input, context }) => {
                console.log("pendingSex的守卫");
                return typeof input.id == "string";
            },
            children: [
                // 同步异步也好像需要考虑
                {
                    id: 2,
                    guard: ({ meta, input }) => {
                        if (input.id == "man") {
                            console.log("resolved的守卫");
                            return true;
                        }
                    },
                    fn: () => {
                        console.log("一个真正的man", "--resolve--");
                    },
                    name: "resolvedMan",
                    type: "final",
                    parentId: 1,
                },
                {
                    id: 3,
                    name: "rejectedMan",
                    guard: async ({ meta, input }) => {
                        await sleep();
                        if (input.id != "man") {
                            console.log("reject的守卫");
                            return true;
                        }
                    },
                    fn: () => {
                        console.log("不是一个真正的man", "--reject--");
                    },
                    type: "final",
                    parentId: 1,
                },
            ],
        },
    ],
    onfinish: (that) => {
        console.log("finish:---", that);
    },
    function: {},
};
let test = new StateMachine(data);
test.setInput({ id: "man" });
test.exexcte();
export {};
