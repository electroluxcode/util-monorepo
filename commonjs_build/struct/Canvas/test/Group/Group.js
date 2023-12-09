"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector2_js_1 = require("../../math/Vector2.js");
const Group_js_1 = require("../../objects/Group.js");
const Img_js_1 = require("../../objects/Img.js");
// step1:基本参数初始化
let size = {
    width: 300,
    height: 300
};
const canvas = document.querySelector("canvas");
canvas.width = size.width;
canvas.height = size.height;
const ctx = canvas?.getContext('2d');
// step2:新建 src
const images = [];
for (let i = 1; i < 5; i++) {
    const image = new Image();
    image.src = `./vue copy ${i}.svg`;
    images.push(image);
}
const group = new Group_js_1.Group();
function ImagePromises(images) {
    return images.map((image) => ImagePromise(image));
}
function ImagePromise(image) {
    return new Promise((resolve) => {
        image.onload = () => {
            resolve(image);
        };
    });
}
// step3:开始 渲染, 
// 重要：这里面主要有一个 add方法
// group 里面 可以几种 draw
function onMount() {
    group.add(...images.map((image, i) => {
        return new Img_js_1.Img({
            image,
            position: new Vector2_js_1.Vector2(200, 80 * i + 50),
            size: new Vector2_js_1.Vector2(image.width, image.height).multiplyScalar(0.3),
            style: {
                shadowColor: 'rgba(0,0,0,0.5)',
                shadowBlur: 2,
                shadowOffsetY: 10,
            },
        });
    }));
    group.draw(ctx);
}
Promise.all(ImagePromises(images)).then(() => {
    onMount();
});
