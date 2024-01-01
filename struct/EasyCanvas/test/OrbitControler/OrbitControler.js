import { OrbitControler } from '../../controler/OrbitControler.js';
import { Scene } from '../../core/Scene.js';
import { Vector2 } from '../../math/Vector2.js';
import { Img2D } from '../../objects/Img2D.js';
// step1:基本参数初始化
let size = {
    width: 900,
    height: 300,
};
const canvas = document.querySelector('canvas');
canvas.width = size.width;
canvas.height = size.height;
const ctx = canvas?.getContext('2d');
// step2:定义场景和轨道控制器.需要手动把scene相机放进轨道控制器,
// 然后就可以在 addEventListener 上面 轨道控制器就可以进行 emit 左右上下的操作，
// 然后 on 的 时候可以 进行 scene 的 渲染
const scene = new Scene();
const orbitControler = new OrbitControler(scene.camera);
const image = new Image();
image.src = '../img.png';
const pattern = new Img2D({ image });
// step3:图片加载后需要做的事
scene.setOption({ canvas });
image.onload = function () {
    const imgSize = new Vector2(image.width, image.height).multiplyScalar(-0.5);
    pattern.setOption({
        size: imgSize.clone(),
        offset: imgSize.clone().multiplyScalar(-0.5),
    });
    console.log('imgSize.clone().multiplyScalar(-0.5)', imgSize.clone().multiplyScalar(-0.5));
    scene.add(pattern);
    /* 监听wheel和pointer 的渲染 */
    orbitControler.on('change', () => {
        scene.render();
    });
    /* 滑动滚轮缩放 */
    canvas.addEventListener('wheel', ({ deltaY }) => {
        orbitControler.doScale(deltaY);
    });
    /* 按住滚轮平移 */
    canvas.addEventListener('pointerdown', (event) => {
        if (event.button == 0) {
            orbitControler.pointerdown(event.clientX, event.clientY);
        }
    });
    canvas.addEventListener('pointermove', (event) => {
        orbitControler.pointermove(event.clientX, event.clientY);
    });
    window.addEventListener('pointerup', (event) => {
        if (event.button == 0) {
            orbitControler.pointerup();
        }
    });
    /* 渲染 */
    scene.render();
};
