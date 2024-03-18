/**
 * @des 函数记忆
 */
declare function memoizeAsync<T>(func: (...args: any[]) => Promise<T>): (...args: any[]) => Promise<T>;
declare function sleep(time: number): Promise<any>;
declare let sleepTest: (...args: any[]) => Promise<any>;
