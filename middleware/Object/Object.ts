/**
 * @des 递归遍历object 不可写 不可新增属性
 * @param obj 
 */
export function deepFreeze(obj: Record<any, any>) {
  // 首先冻结顶层对象
  Object.freeze(obj);

  // 遍历对象的属性  递归冻结嵌套的对象
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && Object.prototype.toString.call(obj[key]) == '[object Object]') {
      deepFreeze(obj[key]);
    }
  }
}


/**
* @des 不可写 不可新增属性
* @param obj 
*/
export function deepSeal(obj: Record<any, any>) {
  // 首先冻结顶层对象
  Object.seal(obj);

  // 遍历对象的属性  递归冻结嵌套的对象
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && Object.prototype.toString.call(obj[key]) == '[object Object]') {
      deepSeal(obj[key]);
    }
  }
}



// 最小监听object 实例
// function immerTest(baseState, thunk){
//     const handler = {
//         // step2.1 获取属性值时的处理 | 递归一次创造代理
//         get(target, prop) {
//             console.log("监听到了:",target,prop)
//             return createProxy(target[prop])
//         },
//         // step2.2 设置属性值时的处理
//         set(target, prop, value) {

//             return true
//         },

//     }

//     function createProxy(base) {
//         // step1.1 判断是否是 object 或者是 array。不是的话不用代理
//         if (Object.prototype.toString.call(base) == "[object Object]" || Array.isArray(base)) {
//             const proxy = new Proxy(base, handler)
//             return proxy
//         }
//         return base
//     }
//     return createProxy(baseState)
// }
// let test= {
//     id:2,
//     name:"dd",
//     obj:{
//         id:2323
//     }
// }
// var my = immerTest(test)
// console.log("测试",my.obj.te)