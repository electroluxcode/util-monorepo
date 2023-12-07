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
// image.style.filter = " blur(10000px)"
/* 绘图 */
image.onload = () => {
    console.log("图像加载完成");
    ctx.save();
    console.log("image:", image);
    // ctx.filter = "blur(10px)"
    console.log(image);
    document.querySelector("img").setAttribute("src", "./img.png");
    // imgSize 前后都一样
    // const imgSize = new Vector2(image.width, image.height).multiplyScalar(1)
    const imgSize = new Vector2(image.width, image.height);
    pattern.setOption({
        // 旋转角度
        // rotate: 0.1,
        // 绘制的起点
        // position: new Vector2(0, 0),
        // scale: new Vector2(1),
        /* Img属性 */
        size: imgSize.clone(),
        // 指的是 起点相对于目标点的绘制 -0.5 就是对角线 也就是 x 左移图片尺寸的 50%，上移图片尺寸的50%，
        // 后续整体向着 右移动 canvas尺寸的 50% 和 下移图片尺寸的50%，就行了
        offset: imgSize.clone().multiplyScalar(-0.5),
        // 对图片进行裁剪
        // view: {
        //     x: 0,
        //     y: 0,
        //     width: image.width / 2,
        //     height: image.height / 2,
        // },
        /* 样式 */
        style: {
            globalAlpha: 1,
            shadowColor: 'rgba(0,0,0,0.5)',
            shadowBlur: 5,
            shadowOffsetY: 20,
            // filter:"contrast(200%) grayscale(80%)"
        },
    });
    ctx.translate(size.width / 2, size.height / 2);
    // draw 的时候 
    // 会先进行option 上面 position, rotate, scale的操作。也就是 object2d.transform 分别调用ctx.drawImage
    // 然后通过 drawShape 分别调用ctx.drawImage
    pattern.draw(ctx);
    // 会根据 pvmoMatrix 和 width，height来进行操作
    pattern.crtPath(ctx);
    ctx.stroke();
    ctx.restore();
};
/* 绘制图案边界 */
