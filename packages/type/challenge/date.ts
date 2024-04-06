type Seperator = "-" | "." | "/";

type Num = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type Num2 = Num | 0;

type YY = `19${Num2}${Num2}` | `20${Num2}${Num2}`;

type MM = `0${Num}` | `1${0 | 1 | 2}`;

type DD = `${0}${Num}` | `${1 | 2}${Num2}` | `3${0 | 1}`;

type GenStr<Type extends string> = Type extends "YY"
	? YY
	: Type extends "MM"
	? MM
	: DD;

type FormatDate<Pattern extends string> =
	//  第一层 infer 年月日
	Pattern extends `${infer Aaa}${Seperator}${infer Bbb}${Seperator}${infer Ccc}`
		? // 第二层infer 分隔符号
		  Pattern extends `${Aaa}${infer Sep}${Bbb}${infer _}${Ccc}`
			? `${GenStr<Aaa>}${Sep}${GenStr<Bbb>}${Sep}${GenStr<Ccc>}`
			: never
		: never;

const a: FormatDate<"YY-MM-DD"> = "2023-01-02";

const b: FormatDate<"DD/MM/YY"> = "01/02/2024";

// const c: FormatDate<"DD/MM/YY"> = "2024-01-02";
