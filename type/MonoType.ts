
//@ts-ignore
declare global {
    namespace MonoType {
        export  type DeepShowType<t> = {
            [k in keyof t] : DeepShowType<t[k]>
        } & {}
        export interface Fn<T = any, R = T> {
            (...arg: T[]): R;
        }

        export interface PromiseFn<T = any, R = T> {
            (...arg: T[]): Promise<R>;
        }
        export type Writable<T> = {
            -readonly [P in keyof T]: T[P];
        };


        export type Nullable<T> = T | null;
        export type Recordable<T = any> = Record<string, T>;

        export type DeepPartial<T> = {
            [P in keyof T]?: DeepPartial<T[P]>;
        };
       
        // feature:需要给object里面的key全部提取出来作为一个ts类型·
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
        export type GenMergeType<t1 extends string,t2 extends any>={
            [key in t1] :keyof t2
        } & t2
    }

}
export {MonoType}