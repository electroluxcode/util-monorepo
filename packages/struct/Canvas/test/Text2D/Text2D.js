import { Text2D } from '../../objects/Text2D.js';
import { OrbitControler } from '../../controler/OrbitControler.js';
import { Scene } from '../../core/Scene.js';
// step1:基本参数初始化
let size = {
    width: 400,
    height: 400
};
const canvas = document.querySelector("canvas");
canvas.width = size.width;
canvas.height = size.height;
const ctx = canvas?.getContext('2d');
// step2:
const scene = new Scene();
const orbitControler = new OrbitControler(scene.camera);
const text2D = new Text2D({
    text: 'Sphinx',
    style: {
        fontSize: 100,
        fillStyle: '#00acec',
        textAlign: 'center',
        textBaseline: 'middle',
    },
});
scene.add(text2D);
const { canvas: { width, height }, } = scene;
ctx.save();
ctx.strokeStyle = 'maroon';
ctx.translate(width / 2, height / 2);
ctx.beginPath();
text2D.crtPath(ctx, text2D.pvmMatrix);
ctx.closePath();
ctx.stroke();
ctx.restore();
scene.setOption({ canvas });
scene.render();
