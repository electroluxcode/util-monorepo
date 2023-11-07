/**
 * @des 函数记忆
 */


function memoizeAsync<T>(
  func: (...args: any[]) => Promise<T>
): (...args: any[]) => Promise<T> {
  const cache: Map<string, Promise<T>> = new Map();

  return async (...args: any[]): Promise<T> => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log("触发记忆")
      return cache.get(key)!;
    }

    const resultPromise = func(...args);
    cache.set(key, resultPromise);

    try {
      const result = await resultPromise;
      return result;
    } catch (error) {
      cache.delete(key);
      throw error;
    }
  };
}

  
async function sleep(time:number): Promise<any> {
  return new Promise((resolve) => {
      setTimeout(() => {
          resolve(time)
      }, time);
  })
}
 
let sleepTest = memoizeAsync(sleep)
console.log(sleepTest(1000))
console.log(sleepTest(5000))
console.log(sleepTest(5000))
// console.log()

