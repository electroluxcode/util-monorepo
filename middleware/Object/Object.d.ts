/**
 * @des 递归遍历object 不可写 不可新增属性
 * @param obj
 */
export declare function deepFreeze(obj: Record<any, any>): void;
/**
* @des 不可写 不可新增属性
* @param obj
*/
export declare function deepSeal(obj: Record<any, any>): void;
