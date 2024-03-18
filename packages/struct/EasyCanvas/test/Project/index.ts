import { Display } from "./Components/Display.js";
let instance = new Display();
instance.mount();
let title;
let link;
let color;
let fontsize;

setTimeout(() => {
	instance;
}, 5000);
document.querySelectorAll("img").forEach((e) => {
	e.addEventListener("click", () => {
		// @ts-ignore
		document.querySelector(".link")!.value = e.getAttribute("src");
	});
});
document.querySelector("[attr='primary']")?.addEventListener("click", () => {
	// @ts-ignore
	title = document.querySelector(".title")!.value;
	// @ts-ignore
	link = document.querySelector(".link")!.value;
	// @ts-ignore
	color = document.querySelector(".color")!.value;
	// @ts-ignore
	fontsize = Number(document.querySelector(".fontsize")!.value);
	let form = {
		title,
		link,
		color,
		fontsize,
	};
	console.log(form);
	instance.setLoganObj(form.link, {
		text: form.title,
		style: {
			fontSize: form.fontsize,
			fillStyle: form.color,
			textAlign: "center",
			textBaseline: "middle",
		},
		index: 9,
	});
});

// setTimeout(() => {
// 	instance.setImage("../img.png");
// }, 3000);
