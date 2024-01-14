import { Scene } from "../../core/Scene.js";
import { Img2D } from "../../objects/Img2D.js";
import { Vector2 } from "../../math/Vector2.js";
import { ImagePromise } from "../../objects/ObjectUtils.js";
class Effector {
    scene = new Scene();
    onMounted(effectDom) {
        const { scene: { canvas }, } = this;
        const { clientWidth: fx, clientHeight: fy } = effectDom;
        effectDom.append(canvas);
        canvas.width = fx;
        canvas.height = fy;
    }
    onUnmounted() {
        this.scene.canvas.remove();
    }
    /* 添加图案 */
    addImgs(effectImg2DData, resultCanvas) {
        const { scene: { canvas: { width }, }, scene, } = this;
        const pros = [];
        effectImg2DData.forEach(({ src, globalCompositeOperation }, index) => {
            let image = new Image();
            if (src) {
                image.src = src;
                pros.push(ImagePromise(image));
            }
            else {
                image = resultCanvas;
            }
            scene.add(new Img2D({
                size: new Vector2(width),
                offset: new Vector2(-width / 2),
                index,
                image,
                style: { globalCompositeOperation },
            }));
        });
        /* 渲染 */
        Promise.all(pros).then(() => {
            scene.render();
        });
    }
    /* 渲染 */
    render() {
        this.scene.render();
    }
}
export { Effector };
