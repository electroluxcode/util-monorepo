import { Scene } from '../../core/Scene.js';
import { Vector2 } from '../../math/Vector2.js';
import { Img2D } from '../../objects/Img2D.js';
// import { ImgControler } from '../../controler/ImgControler.js'
import { OrbitControler } from '../../controler/OrbitControler.js';
import { Group } from '../../objects/Group.js';
import { ImagePromises } from '../../objects/ObjectUtils.js';
import { TransformControler } from '../../controler/TransformControler.js';
// step1:基本参数初始化
let size = {
    width: 400,
    height: 400
};
const canvas = document.querySelector("canvas");
canvas.width = size.width;
canvas.height = size.height;
const scene = new Scene();
const orbitControler = new OrbitControler(scene.camera);
const imgControler = new TransformControler();
scene.add(imgControler);
// 定义图片资源 和 资源容器.需要统一管理
const images = [];
for (let i = 1; i < 5; i++) {
    const image = new Image();
    image.src = `../img.png`;
    images.push(image);
}
const imgGroup = new Group();
scene.add(imgGroup);
/* 鼠标滑上的图案 */
let imgHover;
// step2: 定义渲染之后的事件
function selectObj(imgGroup, mp) {
    // 选择次序问题,可以简单忽略
    for (let img of [...imgGroup].reverse()) {
        if (img instanceof Img2D && scene.isPointInObj(img, mp, img.pvmoMatrix)) {
            return img;
        }
    }
    return null;
}
scene.setOption({ canvas });
Promise.all(ImagePromises(images)).then(() => {
    // group 传入 object2d 的数组
    imgGroup.add(...images.map((image, i) => {
        const size = new Vector2(image.width, image.height).multiplyScalar(0.3);
        return new Img2D({
            image,
            position: new Vector2(0, 160 * i - canvas.height / 2 + 50),
            size,
            offset: new Vector2(-size.x / 2, 0),
            name: 'img-' + i,
        });
    }));
    /* 鼠标按下*/
    canvas.addEventListener('pointerdown', (event) => {
        const { button, clientX, clientY } = event;
        // 转化成裁剪坐标(就是中间的点 作为坐标原点)
        const mp = scene.clientToClip(clientX, clientY);
        // const mp = {x:0,y:0}
        console.log("zptest:点击下去 scene.clienttoClip", mp);
        switch (button) {
            // 鼠标左键
            case 0:
                imgHover = selectObj(imgGroup.children, mp);
                // 重要：控制权交给使用者，如果不想frame出现就注释掉这一行
                imgControler.pointerdown(imgHover, mp);
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
        imgControler.pointermove(mp);
    });
    /* 鼠标抬起 */
    window.addEventListener('pointerup', (event) => {
        if (event.button == 1) {
            orbitControler.pointerup();
        }
        if (event.button == 0) {
            imgControler.pointerup();
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
    imgControler.on('change', () => {
        scene.render();
    });
    /* 渲染 */
    scene.render();
    /* 键盘按下 */
    window.addEventListener('keydown', ({ key, altKey, shiftKey }) => {
        imgControler.keydown(key, altKey, shiftKey);
        // updateMouseCursor()
    });
    /* 键盘抬起 */
    window.addEventListener('keyup', ({ altKey, shiftKey }) => {
        imgControler.keyup(altKey, shiftKey);
    });
});
// step2:scene 重要：
// 2.1  
