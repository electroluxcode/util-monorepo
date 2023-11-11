
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
    }

}
export {MonoType}