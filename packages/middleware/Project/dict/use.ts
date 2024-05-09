import { useDict } from "./dict.js";

// function useReducer<R extends Reducer<any, any>, I>(

// TypeScript 将正确推断 state 和 dispatch 的类型

// 简单

type easyArr<t> = t extends (infer k)[] ? k : any;
type easyArrCase = easyArr<string[]>;

type FunctionReturnType<T> = T extends (...args: any) => infer R ? R : T;
type FRT = FunctionReturnType<() => string>;

// react

/**
 *
 * @des
 * @think 我以前碰到这种东西，基本会考虑 useReducer<string>(reducer, "45"); 这样子传参
 * @think 设计巧妙的 是 第一个参数 类型设置成 any 也不行。第二个参数会根据第一个参数来进行推断
 * @think
 */

// function useReducer<R extends Reducer<any, any>>(
//     reducer: R, initializerArg: ReducerState<R>,
// ): any{return};

// type ReducerState<R extends any> = R extends Reducer<any,infer S> ? S : never;
// type Reducer<S, A> = (prevState: S, action: A) => any;

// const reducer = (x: number,y:string) => {};
// const [state, dispatch] = useReducer(reducer, 23);

function useReducer<R extends any>(
	reducer: R,
	initializerArg: ReducerState<R>
): any {
	return;
}

// 这里可以拿到第一个 参数
type ReducerState<R extends any> = R extends (test: infer arg) => any
	? arg
	: never;
// feature:用于推断类型

const FnCase = (test: string) => {};

// const [state2, dispatch2] = useObject(ObjectCase, "D");
const [state2, dispatch2] = useReducer(FnCase, "23");
