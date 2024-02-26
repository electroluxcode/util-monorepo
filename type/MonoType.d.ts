declare global {
	namespace MonoType {
		type DeepShowType<t> = {
			[k in keyof t]: DeepShowType<t[k]>;
		} & {};
		interface Fn<T = any, R = T> {
			(...arg: T[]): R;
		}
		interface PromiseFn<T = any, R = T> {
			(...arg: T[]): Promise<R>;
		}
		type Writable<T> = {
			-readonly [P in keyof T]: T[P];
		};
		type Nullable<T> = T | null;
		type Recordable<T = any> = Record<string, T>;
		type DeepPartial<T> = {
			[P in keyof T]?: DeepPartial<T[P]>;
		};
		/**
          interface a{
            id:number;
            name:string
          }
          需要变成这样
          interface a{
            NowKey:"id" | "name";
            id:number;
            name:string
          }
         */
		type GenMergeType<t1 extends string, t2 extends any> = {
			[key in t1]: keyof t2;
		} & t2;
	}
}


// 这个需要分配率

type testOnion = { id: string; } | { name: string; };

type testFn<t> = (t extends any ? ((key:t)=>void) :never) extends ((key :infer i ) =>void) ? i : never  
type v = testFn<testOnion>
// type switchon<t> = (t extends (key: t) => void ? t : never) extends (
// 	key: infer i
// ) => void
// 	? i
// 	: never;

export { MonoType };
