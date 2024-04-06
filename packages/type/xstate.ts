interface result {
	types?: any;
	context?: any;
}
type defineStoreType<t extends result> = {
	setContext?: (arg: t["types"]["context"]) => void;
	types?: {
		context: t["types"]["context"];
	};
};
export function xstate<t extends defineStoreType<t>>(props: t) {}
xstate({
	types: {
		context: "" as string,
	},
	setContext(arg: string) {},
});
