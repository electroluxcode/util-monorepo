import { OrbitControler } from "../../controler/OrbitControler.js";
import { Scene } from "../../core/Scene.js";
import { Text2D } from "../../objects/Text2D.js";
import { Vector2 } from "../../math/Vector2.js";
// import { ImgControler } from '../../controler/ImgControler.js'
import { Group } from "../../core/Group.js";
import { TransformControler } from "../../controler/TransformControler.js";
// step1:基本参数初始化
let size = {
    width: 300,
    height: 300,
};
const canvas = document.querySelector("canvas");
canvas.width = size.width;
canvas.height = size.height;
// step1:初始化基本
const scene = new Scene();
const imgControler = new TransformControler();
scene.add(imgControler);
const orbitControler = new OrbitControler(scene.camera);
/* 文字测试 */
const text2D = new Text2D({
    text: "S8989",
    position: new Vector2(0, 0),
    maxWidth: 400,
    style: {
        fontSize: 100,
        fillStyle: "#00acec",
        textAlign: "center",
        textBaseline: "middle",
    },
});
const group = new Group();
scene.add(group);
group.add(text2D);
/* 鼠标滑上的图案 */
let imgHover;
// step2: 定义渲染之后的事件
function selectObj(imgGroup, mp) {
    // 选择次序问题,可以简单忽略
    for (let img of [...imgGroup].reverse()) {
        if (scene.isPointInObj(img, mp, img.pvmoMatrix)) {
            return img;
        }
    }
    return null;
}
canvas.addEventListener("pointerdown", (event) => {
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
canvas.addEventListener("pointermove", (event) => {
    orbitControler.pointermove(event.clientX, event.clientY);
    const mp = scene.clientToClip(event.clientX, event.clientY);
    imgControler.pointermove(mp);
});
/* 鼠标抬起 */
window.addEventListener("pointerup", (event) => {
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
/* 键盘按下 */
window.addEventListener("keydown", ({ key, altKey, shiftKey }) => {
    imgControler.keydown(key, altKey, shiftKey);
    // updateMouseCursor()
});
/* 键盘抬起 */
window.addEventListener("keyup", ({ altKey, shiftKey }) => {
    imgControler.keyup(altKey, shiftKey);
});
/* 绘制文字边界 */
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
scene.setOption({ canvas });
setTimeout(() => {
    scene.render();
}, 0);
// drawRect();
