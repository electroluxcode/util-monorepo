function Pipe(...fns) {
    return function (value) {
        return fns.reduce((acc, fn) => { return fn(acc); }, value);
    };
}
function PipeAsync(...fns) {
    return async function (value) {
        let result = value;
        for (const fn of fns) {
            result = await fn(result);
        }
        return result;
    };
}
export { Pipe, PipeAsync };
