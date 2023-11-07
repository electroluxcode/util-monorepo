// @ts-nocheck
interface PromiseConstructor {
    OrderAll: any
}

(Promise as unknown as PromiseConstructor).OrderAll = function (
    promiseArray: Array<Promise<any>>,that:any
) {
    const arr: Array<any> = [];
    return new Promise(async(resolve) => {
        for (let index = 0; index < promiseArray.length; index++) {
            console.log("that:",that)
            let promiseItem = (promiseArray[index] as any).bind(that)
            let res = await promiseItem()
            arr.push(res)
        }
        resolve(arr)
    });
};


// 只能监听第一层数据
// Promise.OrderAll([sleep1(7000), sleep1(500)]).then((e: any) => {
//     console.log(e)
// })



class DataProxy {
    Data: any
    ProxyFn: Array<Function>
    [key: string]: any;
    constructor(Data: any) {
        this.Data = Data
        this.ProxyFn =  []
    }
    ProxyGet(){
        let that = this
        let ProxyRenderData = new Proxy(this.Data, {
            get: function (target, key) {
                if (key in target) {
                   
                    return target[key]
                }

            },
            set: function (target, key, value) {
                // console.log("触发set", target, key, value)
                target[key] = value;
                
                if(that.ProxyFn){
                    Promise.OrderAll(that.ProxyFn,that.ProxyGet()).then((e:any) => {
                        // console.log("promise代理的结果:", e)
                    })
                }
                return true
                
            }
        })
        return ProxyRenderData
    }
    FnAdd(param: any) {
         // 判断是不是promise
        // if(typeof param.then==="function"){
        //     this.ProxyFn.push(param)
        //     return
        // }
        let temp = param.bind(this.ProxyGet())
        this.ProxyFn.push(temp)
    }
}

// type DataType =typeof   data


// let data = {Data:{id:1}}
// let base = new DataProxy(data)
// let baseData = base.ProxyGet()

// let sleep1 =  function(timeout: number)  {
//     console.log("这是this:",this,timeout)
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve(timeout);

//         }, timeout);
//     })
// }
// /**
//  * @des 把this 绑定就可以使用里面的数据
//  */
// base.FnAdd(async function(){
//    await sleep1.call(this,500)
//    console.log("this:",this)
// })

// baseData.Data=5



// let a = 23
// let b = 56
// base.FnAdd(function(this:DataType){
//     console.log("这是b:",this.Data,b)
// })
// baseData["id"]=5
// console.log("测试数据",baseData)

export {DataProxy}