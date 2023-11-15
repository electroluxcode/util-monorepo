/**
 * @des 递归遍历object 不可写 不可新增属性
 * @param obj 
 */
export function deepFreeze(obj:Record<any,any>) {
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
export function deepSeal(obj:Record<any,any>) {
    // 首先冻结顶层对象
    Object.seal(obj);
  
    // 遍历对象的属性  递归冻结嵌套的对象
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && Object.prototype.toString.call(obj[key]) == '[object Object]') {
        deepSeal(obj[key]);
      }
    }
  }