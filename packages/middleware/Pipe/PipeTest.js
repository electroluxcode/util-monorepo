import { Pipe, PipeAsync } from "./Pipe.js";
let addC = (param) => {
    return param + 10;
};
let plusC = (param) => {
    return param + 10;
};
let pipeCFn = Pipe(addC, plusC);
console.log(pipeCFn(0));
let sleep = (param) => {
    return new Promise((resolve) => {
        setTimeout((param) => {
            resolve(param);
        }, 1000, param);
    });
};
let add = async (param) => {
    let data = await sleep(param);
    return data + 20;
};
let plus = async (param) => {
    let data = await sleep(param);
    return data + 20;
};
let pipeFn = PipeAsync(add, plus);
let d = pipeFn(0);
d.then((e) => {
    console.log(e);
});
