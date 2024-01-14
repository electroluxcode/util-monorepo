import { Scene } from "../../../core/Scene.js";
import { Vector2 } from "../../../math/Vector2.js";
import { Img2D } from "../../../objects/Img2D.js";
// import { ImgControler } from '../../../controler/ImgControler.js'
import { OrbitControler } from "../../../controler/OrbitControler.js";
import { Group } from "../../../core/Group.js";
import { ImagePromises } from "../../../objects/ObjectUtils.js";
import { TransformControler } from "../../../controler/TransformControler.js";
import { Text2D } from "../../../objects/Text2D.js";
// step1:基本参数初始化
let size = {
    width: 400,
    height: 400,
};
const canvas = document.querySelector("canvas");
canvas.width = size.width;
canvas.height = size.height;
// const scene = new Scene();
// const orbitControler = new OrbitControler(scene.camera);
// const imgControler = new TransformControler();
// 定义图片资源 和 资源容器.需要统一管理
let images = [];
// const initImage = ["../img.png", "../img2.jpg", "../img3.jpg", "../img4.jpg"];
const initImage = ["../img3.jpg"];
for (let i = 0; i < initImage.length; i++) {
    const image = new Image();
    image.src = initImage[i];
    images.push(image);
}
/* 鼠标滑上的图案 */
let imgHover;
// step2: 定义渲染之后的事件
function selectObj(imgGroup, mp) {
    // 选择次序问题,可以简单忽略
    let imgRes;
    for (let img of [...imgGroup].reverse()) {
        if (this.scene.isPointInObj(img, mp, img.pvmoMatrix)) {
            console.log("zptest", img, imgGroup, mp);
            return img;
        }
    }
    return null;
}
export class Display {
    scene = new Scene();
    orbitControler = new OrbitControler(this.scene.camera);
    imgControler;
    imgGroup = new Group();
    constructor() { }
    setTextObj(obj) {
        const text2D = new Text2D(obj);
        this.imgGroup.add(text2D);
        // this.scene.render();\
    }
    setImageObj(obj) {
        const image = new Image();
        image.src = obj;
        const size = new Vector2(image.width, image.height).multiplyScalar(1);
        images = [image];
    }
    setLoganObj(img, text) {
        this.imgGroup.clear();
        this.setImageObj(img);
        this.setTextObj(text);
        this.mount();
    }
    mount(scaleKPI = 1) {
        this.scene.remove();
        this.scene.remove(this.imgControler);
        this.imgControler = new TransformControler();
        this.scene.add(this.imgControler);
        this.scene.add(this.imgGroup);
        this.scene.setOption({ canvas });
        Promise.all(ImagePromises(images)).then(() => {
            // group 传入 object2d 的数组
            this.imgGroup.add(...images.map((image, i) => {
                let width = (document.documentElement.clientWidth - 300) / image.width;
                let height = (document.documentElement.clientHeight - 100) / image.height;
                scaleKPI = Math.min(width, height);
                const size = new Vector2(image.width, image.height).multiplyScalar(scaleKPI);
                canvas.width = image.width * scaleKPI;
                canvas.height = image.height * scaleKPI;
                return new Img2D({
                    image,
                    position: new Vector2(0, 0),
                    size,
                    offset: size.clone().multiplyScalar(-0.5),
                    name: "img-" + i,
                });
            }));
            this.scene.render();
        });
        // 绑定window
        window.addEventListener("pointerup", this.pointerup.bind(this));
        window.addEventListener("keydown", this.keydown.bind(this));
        window.addEventListener("keyup", this.keyup.bind(this));
        // 绑定controller
        this.orbitControler.on("change", () => {
            this.scene.render();
        });
        this.imgControler.on("change", () => {
            this.scene.render();
        });
        // 绑定canvas
        canvas.addEventListener("pointerdown", this.pointerdown.bind(this));
        canvas.addEventListener("pointermove", this.pointermove.bind(this));
        // canvas.addEventListener("wheel", this.wheel.bind(this));
        this.scene.render();
    }
    render() {
        this.scene.render();
    }
    /* 滑动滚轮 */
    wheel({ deltaY }) {
        this.orbitControler.doScale(deltaY);
    }
    pointermove(event) {
        this.orbitControler.pointermove(event.clientX, event.clientY);
        const mp = this.scene.clientToClip(event.clientX, event.clientY);
        this.imgControler.pointermove(mp);
    }
    keyup({ altKey, shiftKey }) {
        this.imgControler.keyup(altKey, shiftKey);
    }
    keydown({ key, altKey, shiftKey }) {
        this.imgControler.keydown(key, altKey, shiftKey);
        // updateMouseCursor()
    }
    pointerup(event) {
        if (event.button == 1) {
            this.orbitControler.pointerup();
        }
        if (event.button == 0) {
            this.imgControler.pointerup();
        }
    }
    SelectType(type) {
        let arr = this.imgGroup.children.map((e) => {
            if (e[`is${type}`]) {
                return e;
            }
        });
        if (arr.length) {
            // @ts-ignore
            this.imgControler.pointerdown(arr[0], null);
        }
    }
    pointerdown(event) {
        const { button, clientX, clientY } = event;
        // 转化成裁剪坐标(就是中间的点 作为坐标原点)
        const mp = this.scene.clientToClip(clientX, clientY);
        // const mp = {x:0,y:0}
        switch (button) {
            // 鼠标左键
            case 0:
                imgHover = selectObj.bind(this)(this.imgGroup.children, mp);
                // 重要：控制权交给使用者，如果不想frame出现就注释掉这一行
                this.imgControler.pointerdown(imgHover, mp);
                break;
            // 鼠标中键
            case 1:
                this.orbitControler.pointerdown(clientX, clientY);
                break;
        }
    }
}
