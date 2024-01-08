import { OrbitControler } from "../../controler/OrbitControler.js";

import { Scene } from "../../core/Scene.js";
import { Text2D } from "../../objects/Text2D.js";

import { Vector2 } from "../../math/Vector2.js";
// import { ImgControler } from '../../controler/ImgControler.js'

import { Group } from "../../core/Group.js";

import { Object2D } from "../../core/Object2D.js";

import { TransformControler } from "../../controler/TransformControler.js";
// step1:基本参数初始化
let size = {
	width: 300,
	height: 300,
};
const canvas = document.querySelector("canvas")!;
canvas.width = size.width;
canvas.height = size.height;
const ctx = canvas?.getContext("2d")!;
// 获取父级属性

// 对应canvas 画布的Ref对象

/* 场景 */
// const scene = new Scene();

// /* 相机轨道控制器 */
// const orbitControler = new OrbitControler(scene.camera);

// /* 文字测试 */
// const text2D = new Text2D({
// 	text: "Sphinx",
// 	style: {
// 		fontSize: 100,
// 		fillStyle: "#00acec",
// 		textAlign: "center",
// 		textBaseline: "middle",
// 	},
// });
// scene.add(text2D);

// /* 绘制文字边界 */
// function drawRect() {
// 	const {
// 		ctx,
// 		canvas: { width, height },
// 	} = scene;
// 	ctx.save();
// 	ctx.strokeStyle = "maroon";
// 	ctx.translate(width / 2, height / 2);
// 	ctx.beginPath();
// 	text2D.crtPath(ctx, text2D.pvmMatrix);
// 	ctx.closePath();
// 	ctx.stroke();
// 	ctx.restore();
// }
// if (canvas) {
// 	scene.setOption({ canvas });
// 	scene.render();
// 	drawRect();
// }

// 1. 初始化基本
const scene = new Scene();

function selectObj(imgGroup: Object2D[], mp: Vector2): Object2D | null {
	// 选择次序问题,可以简单忽略
	for (let img of [...imgGroup].reverse()) {
		if (scene.isPointInObj(img, mp, img.pvmoMatrix)) {
			return img;
		}
	}
	return null;
}
const text2D = new Text2D({
	text: "Sphinx",
	style: {
		fontSize: 100,
		fillStyle: "#00acec",
		textAlign: "center",
		textBaseline: "middle",
	},
});
// scene.add(text2D);
let imgHover;
const group = new Group();
group.add(text2D);
scene.add(group);

const imgControler = new TransformControler();
scene.add(imgControler);
const orbitControler = new OrbitControler(scene.camera);
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
