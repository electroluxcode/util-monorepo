"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipeAsync = exports.Pipe = void 0;
function Pipe(...fns) {
    return function (value) {
        return fns.reduce((acc, fn) => { return fn(acc); }, value);
    };
}
exports.Pipe = Pipe;
function PipeAsync(...fns) {
    return async function (value) {
        let result = value;
        for (const fn of fns) {
            result = await fn(result);
        }
        return result;
    };
}
exports.PipeAsync = PipeAsync;
