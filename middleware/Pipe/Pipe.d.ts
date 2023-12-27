declare function Pipe<k extends any>(...fns: Array<(...arg: any) => any>): (value: k) => any;
declare function PipeAsync<k extends any>(...fns: Array<(...arg: any) => any>): (value: k) => Promise<k>;
export { Pipe, PipeAsync };
