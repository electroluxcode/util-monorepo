import { OrbitControler } from "../../controler/OrbitControler.js";

import { Scene } from "../../core/Scene.js";

import { Vector2 } from "../../math/Vector2.js";
// import { ImgControler } from '../../controler/ImgControler.js'

import { Group } from "../../core/Group.js";

import { Object2D } from "../../core/Object2D.js";

import { TransformControler } from "../../controler/TransformControler.js";
import { Arc2D } from "../../objects/Arc2D.js";
let imgHover: Object2D | null;
// step1:基本参数初始化
let size = {
	width: 300,
	height: 300,
};
const canvas = document.querySelector("canvas")!;
canvas.width = size.width;
canvas.height = size.height;

// 1. 初始化基本
const scene = new Scene();

const text2D = new Arc2D({
	color: "blue",
	radius: 50,
	position: new Vector2(-0, -0),
});
const group = new Group();
scene.add(group);
group.add(text2D);
const imgControler = new TransformControler();
scene.add(imgControler);
const orbitControler = new OrbitControler(scene.camera);

// 2. 添加事件

function selectObj(imgGroup: Object2D[], mp: Vector2): Object2D | null {
	// 选择次序问题,可以简单忽略
	for (let img of [...imgGroup].reverse()) {
		if (scene.isPointInObj(img, mp, img.pvmoMatrix)) {
			return img;
		}
	}
	return null;
}
canvas.addEventListener("pointerdown", (event: PointerEvent) => {
	const { button, clientX, clientY } = event;
	// 转化成裁剪坐标(就是中间的点 作为坐标原点)
	const mp = scene.clientToClip(clientX, clientY);
	// const mp = {x:0,y:0}
	// console.log("zptest:点击下去 scene.clienttoClip", mp);
	switch (button) {
		// 鼠标左键
		case 1:
			orbitControler.pointerdown(clientX, clientY);
			break;
		// 鼠标中键
		case 0:
			imgHover = selectObj(group.children, mp);
			// imgHover = selectObj([text2D], mp);
			console.log("zptest:", imgHover, group);
			// 重要：控制权交给使用者，如果不想frame出现就注释掉这一行
			imgControler.pointerdown(imgHover, mp);

			break;
	}
});

/* 鼠标移动 */
canvas.addEventListener("pointermove", (event: PointerEvent) => {
	orbitControler.pointermove(event.clientX, event.clientY);
	const mp = scene.clientToClip(event.clientX, event.clientY);
	imgControler.pointermove(mp);
});

/* 鼠标抬起 */
window.addEventListener("pointerup", (event: PointerEvent) => {
	if (event.button == 1) {
		orbitControler.pointerup();
	}
	if (event.button == 0) {
		imgControler.pointerup();
	}
});

/* 滑动滚轮缩放 */
canvas.addEventListener("wheel", ({ deltaY }) => {
	orbitControler.doScale(deltaY);
});

/* 按需渲染 */
orbitControler.on("change", () => {
	scene.render();
});
imgControler.on("change", () => {
	scene.render();
});
/* 绘制文字边界 */

if (canvas) {
	scene.setOption({ canvas });
	scene.render();
}
