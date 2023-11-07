/**
 * @des 函数记忆
 */
function memoizeAsync(func) {
    const cache = new Map();
    return async (...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            console.log("触发记忆");
            return cache.get(key);
        }
        const resultPromise = func(...args);
        cache.set(key, resultPromise);
        try {
            const result = await resultPromise;
            return result;
        }
        catch (error) {
            cache.delete(key);
            throw error;
        }
    };
}
async function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(time);
        }, time);
    });
}
let sleepTest = memoizeAsync(sleep);
console.log(sleepTest(1000));
console.log(sleepTest(5000));
console.log(sleepTest(5000));
// console.log()
