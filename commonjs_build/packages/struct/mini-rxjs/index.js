// 核心概念
/**
 
- observable 观察对象(对事件的封装)
    - pullable 每一次观测数据需要拉取
    - pushable 需要推送数据给别人
- observer 观察者
- observable 返回的对象叫做 source，
    - subscribe 方法中能够传入 function 数组
    - 这个玩意有subscribe方法，返回的对象叫做 subjection


听说是参考了callbag的一些概念

-
 */
/**
 * @des 最值得学习的就是传入两个function
 * 第一个function是正常的流程。(中间埋点)
 * 第二个流程是暴露埋点处理的方法
 */
class observable {
    excuteFn;
    unsubribeArr = [];
    constructor(excuteFn) {
        this.excuteFn = excuteFn;
    }
    subscribe(eventObj) {
        let evCase = new subscribeEnchance(eventObj);
        let un = this.excuteFn(evCase);
        this.unsubribeArr.push(un);
    }
    pipe(...arg) {
        let that = this;
        return () => {
            return arg.reduce((all, now) => {
                return now(all);
            }, that);
        };
    }
    unsubscribe() {
        this.unsubribeArr.forEach((e) => {
            e();
        });
    }
}
function map(pipes) {
    return (ob) => new observable((sub) => {
        return ob.subscribe({
            next: (v) => {
                console.log("我通过了中间件");
                sub.next(pipes(v));
            },
        });
    });
}
class subscribeEnchance {
    fn;
    isStop = false;
    constructor(fn) {
        this.fn = fn;
    }
    next(value) {
        this.fn.next(value);
    }
    error(value) {
        this.fn.error(value);
    }
    complete(value) {
        this.fn.complete(value);
    }
}
// // evobj 有 next complete 等方法
// const source = new observable((evObj) => {
// 	let i = 0;
// 	const timer = setInterval(() => {
// 		evObj.next(++i);
// 	}, 1000);
// 	return () => {
// 		clearInterval(timer);
// 	};
// });
// const sub = source.subscribe({
// 	next: (v) => {
// 		console.log("vvv:", v);
// 	},
// });
// setTimeout(() => {
// 	source.unsubscribe();
// }, 4000);
const source = new observable((evObj) => {
    let i = 0;
    const timer = setInterval(() => {
        evObj.next(++i);
    }, 1000);
    return () => {
        clearInterval(timer);
    };
});
console.log("-:", source.pipe(map((i) => i + 10)));
const sub = source
    .pipe(map((i) => i + 10))()
    .subscribe({
    next: (v) => {
        console.log("vvv:", v);
    },
});
setTimeout(() => {
    source.unsubscribe();
}, 4000);
