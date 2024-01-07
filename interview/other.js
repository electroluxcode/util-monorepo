 // 1.手写 setInterval
// function setInterval(fn:Function,timeOut:number){
//     setTimeout(({timeOut,fn}) => {
//         fn()
//         console.log("两秒输出一次")
//         setInterval(fn,timeOut)
//     },timeOut,{ timeOut,fn});
// }

// setInterval(()=>{

// },2000)

// 2.翻转局部链表





// 3.给一个字符串，筛选出所有的数字
// let input = "569odsakd45"
// let reg = /\d/g
// function output(input:string){
//     console.log(input.match(reg))
// }
// output(input)

// 4. 倒计时组件
/**
 * @des 考虑到 interval 有误差一般都会用 settimeout + 服务器实现,比较容易
 */

// function CountHook(restTime:number,timeInterval:number,fn:Function){
//     let count = restTime
//     let isPause = false
//     let time = setInterval((timeInterval) => {
//         count =  count - timeInterval
//         if(count>0){
//             fn(count)
//         }
        
//     }, timeInterval,timeInterval);
//     let pause = ()=>{
//         console.log("暂停")
//     }
//     let start = () =>{
//         console.log("开始")
//     }
//     let clear = ()=>{
//         clearInterval(time)
//     }
    
//     return {start,pause,clear}
// }
// CountHook(5000,1000,(param)=>{
//     console.log("zptest:",param)
// })

// 5. 转化字符串
/**
 * 
 */

 function destructuringArray(array, destructor) {
    let temp = Array.isArray(array)? [] : {};
    for(let i in destructor){
        if(Array.isArray(destructor[i])){
            temp = {
                ...temp,
                ...destructuringArray(array[i],destructor[i])
            }
        }else{
            temp[destructor[i]] = array[i]
        }
    }
    return temp
}
console.log(destructuringArray([1, [2, 4], 3], ['a', ['b',"d"], 'c']));

// 6.手写promise
class MyPromise{
    status:"pending" | "fulling" | "reject" 
    constructor(fn){
        this.status = "pending"

        fn(this.resolve,this.reject)
    }
    resolve(){
        this.status = "fulling"
    }
    reject(){
        this.status = "reject"
    }
}
new Promise((resolve,reject)=>{resolve(5)})




let arr = new Array()




/**
 for (let [key, val] of Object.entries(attr)) {
        this[key] = val
    }
 *
 */ 


// 1.手写 setInterval
// function setInterval(fn:Function,timeOut:number){
//     setTimeout(({timeOut,fn}) => {
//         fn()
//         console.log("两秒输出一次")
//         setInterval(fn,timeOut)
//     },timeOut,{ timeOut,fn});
// }

// setInterval(()=>{

// },2000)

// 2.翻转局部链表





// 3.给一个字符串，筛选出所有的数字
// let input = "569odsakd45"
// let reg = /\d/g
// function output(input:string){
//     console.log(input.match(reg))
// }
// output(input)

// 4. 倒计时组件
/**
 * @des 考虑到 interval 有误差一般都会用 settimeout + 服务器实现,比较容易
 */

// function CountHook(restTime:number,timeInterval:number,fn:Function){
//     let count = restTime
//     let isPause = false
//     let time = setInterval((timeInterval) => {
//         count =  count - timeInterval
//         if(count>0){
//             fn(count)
//         }
        
//     }, timeInterval,timeInterval);
//     let pause = ()=>{
//         console.log("暂停")
//     }
//     let start = () =>{
//         console.log("开始")
//     }
//     let clear = ()=>{
//         clearInterval(time)
//     }
    
//     return {start,pause,clear}
// }
// CountHook(5000,1000,(param)=>{
//     console.log("zptest:",param)
// })

// 5. 转化字符串
/**
 * 
 */

 function destructuringArray(array, destructor) {
    let temp = Array.isArray(array)? [] : {};
    for(let i in destructor){
        if(Array.isArray(destructor[i])){
            temp = {
                ...temp,
                ...destructuringArray(array[i],destructor[i])
            }
        }else{
            temp[destructor[i]] = array[i]
        }
    }
    return temp
}
console.log(destructuringArray([1, [2, 4], 3], ['a', ['b',"d"], 'c']));

// 6.手写promise
class MyPromise{
    status:"pending" | "fulling" | "reject" 
    constructor(fn){
        this.status = "pending"

        fn(this.resolve,this.reject)
    }
    resolve(){
        this.status = "fulling"
    }
    reject(){
        this.status = "reject"
    }
}
new Promise((resolve,reject)=>{resolve(5)})

