import { OrbitControler } from "../../controler/OrbitControler.js";
import { Scene } from "../../core/Scene.js";
import { Text2D } from "../../objects/Text2D.js";
// step1:基本参数初始化
let size = {
    width: 300,
    height: 300,
};
const canvas = document.querySelector("canvas");
canvas.width = size.width;
canvas.height = size.height;
const ctx = canvas?.getContext("2d");
// 获取父级属性
// 对应canvas 画布的Ref对象
/* 场景 */
const scene = new Scene();
/* 相机轨道控制器 */
const orbitControler = new OrbitControler(scene.camera);
/* 文字测试 */
const text2D = new Text2D({
    text: "Sphinx",
    style: {
        fontSize: 100,
        fillStyle: "#00acec",
        textAlign: "center",
        textBaseline: "middle",
    },
});
scene.add(text2D);
/* 按需渲染 */
/* 滑动滚轮缩放 */
function wheel({ deltaY }) {
    orbitControler.doScale(deltaY);
}
/* 按住滚轮平移 */
function pointerdown(event) {
    if (event.button == 1) {
        orbitControler.pointerdown(event.clientX, event.clientY);
    }
}
function pointermove(event) {
    orbitControler.pointermove(event.clientX, event.clientY);
}
function pointerup(event) {
    if (event.button == 1) {
        orbitControler.pointerup();
    }
}
/* 绘制文字边界 */
function drawRect() {
    const { ctx, canvas: { width, height }, } = scene;
    ctx.save();
    ctx.strokeStyle = "maroon";
    ctx.translate(width / 2, height / 2);
    ctx.beginPath();
    text2D.crtPath(ctx, text2D.pvmMatrix);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}
if (canvas) {
    scene.setOption({ canvas });
    scene.render();
    drawRect();
}
