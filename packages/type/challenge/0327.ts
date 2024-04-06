type MyRecord<t> = {
	[k in keyof t]: t[k];
};

type MyPick<key extends keyof obj, obj> = {
	[k in key]: obj[k];
};

type pro = "id" | "name";
type proObj = {
	id: string;
	name: string;
	age: number;
};
type proO = MyPick<pro, proObj>;
