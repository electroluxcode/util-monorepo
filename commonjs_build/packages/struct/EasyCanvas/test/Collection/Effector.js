"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Effector = void 0;
const Scene_js_1 = require("../../core/Scene.js");
const Img2D_js_1 = require("../../objects/Img2D.js");
const Vector2_js_1 = require("../../math/Vector2.js");
const ObjectUtils_js_1 = require("../../objects/ObjectUtils.js");
class Effector {
    scene = new Scene_js_1.Scene();
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
                pros.push((0, ObjectUtils_js_1.ImagePromise)(image));
            }
            else {
                image = resultCanvas;
            }
            scene.add(new Img2D_js_1.Img2D({
                size: new Vector2_js_1.Vector2(width),
                offset: new Vector2_js_1.Vector2(-width / 2),
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
exports.Effector = Effector;
