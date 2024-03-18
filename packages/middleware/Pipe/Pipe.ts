function Pipe<k extends any>(...fns:Array<(...arg: any) => any>) {
    return function (value:k) {
        return fns.reduce((acc, fn) =>{return fn(acc)}, value)
    }
}

function PipeAsync<k extends any>(...fns:Array<(...arg: any) => any>) {
    return async function (value:k) {
        let result = value;
        for (const fn of fns) {
            result = await fn(result);
        }
        return result;
    }
}
export {
    Pipe,PipeAsync
}