// project_styled_cache
export const base1 = {
	// 作用域 类名
	element: "container",
	position: "relative",
	class: {
		// 类名
		one: {
			position: "relative",
			left: "200px",
			top: "100px",
			transform: "scale(1)",
			"transform-origin": "left top",
		},
	},
	tabs: [
		{
			// 类名
			name: "项目简介",
			route: "overview/bim",
			children: [
				{
					name: "项目概况-tab1",
					children: [],
				},
			],
		},
		{
			// 类名
			name: "进出场统计",
			route: "overview/bim",
			children: [
				{
					name: "进出场统计-tab1",
					route: "overview/bim",
					children: [],
				},
				{
					name: "进出场统计-tab2",
					route: "overview/bim",
					children: [],
				},
			],
		},
	],
};
export const base2 = {
	element: "container",
	display: "grid",
	"grid-template-columns": "1fr 1fr 1fr 1fr 1fr",
	"grid-template-rows": "1fr 1fr 1fr 1fr 1fr",
	class: {
		// 类名
		one: {
			"grid-column": "1 / span 1",
			"grid-row": "1 / span 2",
		},
	},
	tabs: {
		// 类名
		one: ["测试项目", "测试"],
		two: ["测试项目", "22测试"],
	},
};

export const base3 = {
	element: "container",
	position: "absolute",
	class: {
		// 类名
		one: {
			left: "30px",
			width: "200px",
			right: " 20px",
			height: "200px",
		},
		two: {
			left: "30px",
			width: "200px",
			right: " 20px",
			height: "200px",
		},
	},
	tabs: {
		// 类名
		one: ["测试项目", "测试"],
		two: ["测试项目", "22测试"],
	},
};
export function convertToCSS(obj) {
	let cssString = "";

	for (const key in obj.class) {
		if (Object.hasOwnProperty.call(obj.class, key)) {
			const className = `.${obj.element} .${key} {`;
			cssString += className;

			const properties = obj.class[key];
			for (const prop in properties) {
				if (Object.hasOwnProperty.call(properties, prop)) {
					cssString += `${prop}: ${properties[prop]} !important;`;
				}
			}

			cssString += "}";
		}
	}
	const className = ` .${obj.element}  {`;
	cssString += className;

	delete obj["class"];
	delete obj["tab"];
	delete obj["element"];

	for (const key in obj) {
		cssString += `${key}: ${obj[key]} !important;`;
	}
	cssString += "}";

	const styleTag = document.createElement("style");
	styleTag.type = "text/css";

	// 添加 CSS 字符串到 <style> 标签中
	if (styleTag.styleSheet) {
		styleTag.styleSheet.cssText = cssString;
	} else {
		styleTag.appendChild(document.createTextNode(cssString));
	}
	console.log(cssString);
	document.head.appendChild(styleTag);
}

// 使用示例
// const base1CSS = convertToCSS(base3);
// console.log(base1CSS);
