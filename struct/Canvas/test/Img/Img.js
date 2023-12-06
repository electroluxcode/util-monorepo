import { Vector2 } from '../../math/Vector2.js';
import { Img } from '../../objects/Img.js';
// step1:基本参数初始化
let size = {
    width: 600,
    height: 600
};
const canvas = document.querySelector("canvas");
canvas.width = size.width;
canvas.height = size.height;
const ctx = canvas?.getContext('2d');
// 2.img 对象操作 初始化
const image = new Image();
image.src = './img.png';
const pattern = new Img({ image });
// 3.进行操作
/* 绘图 */
image.onload = () => {
    console.log("图像加载完成");
    ctx.save();
    // imgSize 前后都一样
    // const imgSize = new Vector2(image.width, image.height).multiplyScalar(1)
    const imgSize = new Vector2(image.width, image.height);
    console.log("imgSize:", imgSize);
    pattern.setOption({
        // 旋转角度
        rotate: 0.1,
        // 绘制的起点
        position: new Vector2(0, 0),
        scale: new Vector2(1),
        /* Img属性 */
        size: imgSize.clone(),
        // 矩阵变换
        offset: imgSize.clone().multiplyScalar(-0.5),
        // view: {
        //     x: 0,
        //     y: 0,
        //     width: image.width / 2,
        //     height: image.height / 2,
        // },
        /* 样式 */
        style: {
            globalAlpha: 0.8,
            shadowColor: 'rgba(0,0,0,0.5)',
            shadowBlur: 5,
            shadowOffsetY: 20,
        },
    });
    ctx.translate(size.width / 2, size.height / 2);
    pattern.draw(ctx);
    pattern.crtPath(ctx);
    ctx.stroke();
    ctx.restore();
};
/* 绘制图案边界 */
