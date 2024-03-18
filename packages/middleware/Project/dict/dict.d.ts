type DeepShowType<t> = {
    [key in keyof t]: t[key];
} & {};
type EnhanceType = "ValueToCn" | "ValueToEnglish" | "CnToValue" | "CnToEnglish" | "EnglishToValue" | "EnglishToCn";
type GetterAble<t extends string, k extends string> = t extends any ? {
    [v in `${t}${k}`]: DeepShowType<Record<EnhanceType, any>>;
} | {
    [v in `${t}`]: any;
} : any;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
declare function KeyApiDataSwitch<t extends string>(DataDictTest: any): UnionToIntersection<GetterAble<t, "Enhance">>;
export { KeyApiDataSwitch };
