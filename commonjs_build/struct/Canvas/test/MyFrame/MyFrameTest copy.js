"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Scene_js_1 = require("../../core/Scene.js");
const Img2D_js_1 = require("../../objects/Img2D.js");
const MyFrame_js_1 = require("../../ext/MyFrame.js");
const ObjectUtils_js_1 = require("../../objects/ObjectUtils.js");
const Vector2_js_1 = require("../../math/Vector2.js");
const Group_js_1 = require("../../objects/Group.js");
const OrbitControler_js_1 = require("../../controler/OrbitControler.js");
// step1:基本参数初始化
let size = {
    width: 400,
    height: 400
};
const canvas = document.querySelector("canvas");
canvas.width = size.width;
canvas.height = size.height;
const ctx = canvas?.getContext('2d');
const scene = new Scene_js_1.Scene();
scene.setOption({ canvas });
// frame 需要针对 image 绘图
let frame = new MyFrame_js_1.MyFrame();
const orbitControler = new OrbitControler_js_1.OrbitControler(scene.camera);
canvas.addEventListener('pointerdown', (event) => {
    const { button, clientX, clientY } = event;
    // 转化成裁剪坐标(就是中间的点 作为坐标原点)
    const mp = scene.clientToClip(clientX, clientY);
    // const mp = {x:0,y:0}
    console.log("zptest:点击下去 scene.clienttoClip", mp);
    switch (button) {
        // 鼠标左键
        case 0:
            break;
        // 鼠标中键
        case 1:
            orbitControler.pointerdown(clientX, clientY);
            break;
    }
});
/* 鼠标移动 */
canvas.addEventListener('pointermove', (event) => {
    orbitControler.pointermove(event.clientX, event.clientY);
    orbitControler.pointermove(event.clientX, event.clientY);
    const mp = scene.clientToClip(event.clientX, event.clientY);
});
/* 鼠标抬起 */
window.addEventListener('pointerup', (event) => {
    if (event.button == 1) {
        orbitControler.pointerup();
    }
});
/* 滑动滚轮缩放 */
canvas.addEventListener('wheel', ({ deltaY }) => {
    orbitControler.doScale(deltaY);
});
/* 按需渲染 */
orbitControler.on('change', () => {
    scene.render();
});
// 定义图片资源 和 资源容器.需要统一管理
const images = [];
for (let i = 1; i < 5; i++) {
    const image = new Image();
    image.src = `../img.png`;
    images.push(image);
}
const imgGroup = new Group_js_1.Group();
scene.add(imgGroup);
function selectObj(imgGroup, mp) {
    // 选择次序问题,可以简单忽略
    for (let img of [...imgGroup].reverse()) {
        if (img instanceof Img2D_js_1.Img2D && scene.isPointInObj(img, mp, img.pvmoMatrix)) {
            return img;
        }
    }
    return null;
}
Promise.all((0, ObjectUtils_js_1.ImagePromises)(images)).then(() => {
    imgGroup.add(...images.map((image, i) => {
        const size = new Vector2_js_1.Vector2(image.width, image.height).multiplyScalar(0.3);
        return new Img2D_js_1.Img2D({
            image,
            position: new Vector2_js_1.Vector2(0, 160 * i - canvas.height / 2 + 50),
            size,
            offset: new Vector2_js_1.Vector2(-size.x / 2, 0),
            name: 'img-' + i,
        });
    }));
    canvas.addEventListener('click', ({ clientX, clientY }) => {
        // 转化成 以中心作为基础点的坐标
        const mp = scene.clientToClip(clientX, clientY);
        let MouseState = selectObj(imgGroup.children, mp);
        console.log("zptest:", MouseState);
        if (MouseState) {
            frame.img = MouseState;
            let mouseState = frame.getMouseState(mp);
            console.log("zptest:", mouseState);
            frame.draw(scene.ctx, true);
        }
        // scene.render()
    });
    ani();
});
// frame.img = pattern
function ani(time = 0) {
    scene.render();
    // requestAnimationFrame(() => { ani(time + 15) })
}
