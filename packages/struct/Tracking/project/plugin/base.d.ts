declare type returnItemBaseType = {
	// 当前界面url
	url: string;
	type: "ErrorEvent" | "ErrorResource" | "lcp";
	extraInfo: any;
	children?: returnItemBaseType[];
	name?: string;
	user?: {
		ua: any;
		user: any;
	};
};
