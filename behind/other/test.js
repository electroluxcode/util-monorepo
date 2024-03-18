const listTotree = (arr) => {
	let tree = [];
	arr.forEach((element) => {
		element.child = arr.filter((e) => {
			return element.id == e.parentId;
		});
		if (!element.parentId) {
			tree.push(element);
		}
	});
	return tree;
};

let arr = [
	{
		id: 1,
		name: "小米",
		parentId: null,
	},
	{
		id: 2,
		name: "小红",
		parentId: 1,
	},
	{
		id: 3,
		name: "小白",
		parentId: null,
	},
];

listTotree(arr);

let tree = [
	{
		id: 1,
		name: "小米",
		parentId: null,
		child: [
			{
				id: 2,
				name: "小红",
				parentId: 1,
				child: [],
			},
		],
	},
	{
		id: 3,
		name: "小白",
		parentId: null,
		child: [],
	},
];

let treeTolist = (tree) => {
	let arr = [];
	for (let i = 0; i < tree.length; i++) {
		if (Array.isArray(tree[i]["child"]) && tree[i]["child"].length) {
			arr = treeTolist(tree[i]["child"]);
		}
		arr.push(tree[i]);
	}
	return arr;
};

treeTolist(tree);
