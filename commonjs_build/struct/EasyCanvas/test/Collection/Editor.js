"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Editor = void 0;
const TransformControler_js_1 = require("../../controler/TransformControler.js");
const OrbitControler_js_1 = require("../../controler/OrbitControler.js");
const Scene_js_1 = require("../../core/Scene.js");
const Group_js_1 = require("../../core/Group.js");
const Img2D_js_1 = require("../../objects/Img2D.js");
const Vector2_js_1 = require("../../math/Vector2.js");
const ObjectUtils_js_1 = require("../../objects/ObjectUtils.js");
const Object2D_js_1 = require("../../core/Object2D.js");
class Editor extends Object2D_js_1.Object2D {
    /* 编辑器场景 */
    editorScene = new Scene_js_1.Scene();
    /* 编辑器中的图案 */
    group = new Group_js_1.Group();
    /* 图案控制器 */
    transformControler = new TransformControler_js_1.TransformControler();
    /* 相机轨道控制器 */
    orbitControler = new OrbitControler_js_1.OrbitControler(this.editorScene.camera);
    /* 鼠标划入的图形 */
    objHover = null;
    /* 鼠标状态 */
    cursor = "default";
    /* 设计尺寸 */
    designSize = 0;
    /* 设计图 */
    designImg = new Img2D_js_1.Img2D({
        index: 1000,
    });
    /* 虚拟场景 */
    resultScene = new Scene_js_1.Scene();
    /* 虚拟场景里的图案集合 */
    resultGroup = new Group_js_1.Group();
    constructor() {
        super();
        const { editorScene, orbitControler, group, transformControler, designImg, resultScene, resultGroup, } = this;
        /* 编辑器场景*/
        editorScene.add(group, transformControler, designImg);
        /* 虚拟场景 */
        resultScene.add(resultGroup);
        /* 渲染编辑器和虚拟场景 */
        transformControler.on("change", () => {
            this.render();
        });
        orbitControler.on("change", () => {
            this.render();
        });
        /* 虚拟场景的图案同步编辑器场景的图案 */
        // 添加图案
        group.on("add", ({ obj }) => {
            if (obj instanceof Img2D_js_1.Img2D) {
                const { image, position, rotate, scale, offset, size, uuid } = obj;
                resultGroup.add(new Img2D_js_1.Img2D({
                    image,
                    position,
                    rotate,
                    scale,
                    offset,
                    size,
                    uuid,
                }));
            }
        });
        // 变换图案
        transformControler.on("transformed", ({ obj }) => {
            const { position, rotate, scale, offset } = obj;
            const resultImg = resultGroup.children[group.children.indexOf(obj)];
            if (resultImg instanceof Img2D_js_1.Img2D) {
                resultImg.setOption({
                    position,
                    rotate,
                    scale,
                    offset,
                });
            }
        });
        // 删除图案
        group.on("remove", ({ obj }) => {
            resultGroup.getObjectByProperty("uuid", obj.uuid)?.remove();
        });
    }
    onMounted(editorDom, effectDom) {
        const { editorScene: { canvas }, resultScene: { canvas: resultCanvas }, resultGroup, } = this;
        /* 编辑器 */
        editorDom.append(canvas);
        const { clientWidth: dx, clientHeight: dy } = editorDom;
        canvas.width = dx;
        canvas.height = dy;
        /* 设计尺寸 */
        const designSize = Math.min(dx, dy) * 0.5;
        this.designSize = designSize;
        /* 编辑器事件监听 */
        canvas.addEventListener("pointerdown", this.pointerdown.bind(this));
        canvas.addEventListener("pointermove", this.pointermove.bind(this));
        window.addEventListener("pointerup", this.pointerup.bind(this));
        window.addEventListener("keydown", this.keydown.bind(this));
        window.addEventListener("keyup", this.keyup.bind(this));
        canvas.addEventListener("wheel", this.wheel.bind(this));
        canvas.addEventListener("contextmenu", this.contextmenu.bind(this));
        /* 虚拟场景 */
        const { clientWidth: fx, clientHeight: fy } = effectDom;
        resultCanvas.width = fx;
        resultCanvas.height = fy;
        resultGroup.setOption({
            scale: new Vector2_js_1.Vector2(fx / designSize),
            position: new Vector2_js_1.Vector2(0, fx * 0.12),
        });
    }
    onUnmounted() {
        const { editorScene: { canvas }, } = this;
        /* 删除canvas，避免onMounted时重复添加 */
        canvas.remove();
        /* 取消事件监听 */
        canvas.removeEventListener("pointerdown", this.pointerdown);
        canvas.removeEventListener("pointermove", this.pointermove);
        window.removeEventListener("pointerup", this.pointerup);
        window.removeEventListener("keydown", this.keydown);
        window.removeEventListener("keyup", this.keyup);
        canvas.removeEventListener("wheel", this.wheel);
        canvas.removeEventListener("contextmenu", this.contextmenu);
    }
    /* 鼠标按下 */
    pointerdown(event) {
        const { editorScene, transformControler, group, orbitControler } = this;
        const { button, clientX, clientY } = event;
        const mp = editorScene.clientToClip(clientX, clientY);
        switch (button) {
            case 0:
                this.objHover = (0, ObjectUtils_js_1.SelectObj)(editorScene)(group.children, mp);
                transformControler.pointerdown(this.objHover, mp);
                this.updateMouseCursor();
                break;
            case 1:
                orbitControler.pointerdown(clientX, clientY);
                break;
        }
    }
    /* 鼠标移动 */
    pointermove(event) {
        const { editorScene, transformControler, group, orbitControler } = this;
        const { clientX, clientY } = event;
        const mp = editorScene.clientToClip(clientX, clientY);
        orbitControler.pointermove(clientX, clientY);
        transformControler.pointermove(mp);
        this.objHover = (0, ObjectUtils_js_1.SelectObj)(editorScene)(group.children, mp);
        this.updateMouseCursor();
    }
    /* 鼠标抬起 */
    pointerup({ button }) {
        switch (button) {
            case 0:
                this.transformControler.pointerup();
                break;
            case 1:
                this.orbitControler.pointerup();
                break;
        }
    }
    /* 键盘按下 */
    keydown({ key, altKey, shiftKey }) {
        this.transformControler.keydown(key, altKey, shiftKey);
        this.updateMouseCursor();
    }
    /* 键盘抬起 */
    keyup({ altKey, shiftKey }) {
        this.transformControler.keyup(altKey, shiftKey);
    }
    /* 滑动滚轮 */
    wheel({ deltaY }) {
        this.orbitControler.doScale(deltaY);
    }
    /* 取消右键的默认功能 */
    contextmenu(event) {
        event.preventDefault();
    }
    /* 更新鼠标样式 */
    updateMouseCursor() {
        const { transformControler, cursor, objHover } = this;
        if (transformControler.mouseState) {
            this.cursor = "none";
        }
        else if (objHover) {
            this.cursor = "pointer";
        }
        else {
            this.cursor = "default";
        }
    }
    /* 设计图和效果图的渲染 */
    render() {
        this.editorScene.render();
        this.resultScene.render();
        this.emit({ type: "render" });
    }
    /* 添加图案 */
    addImg(image) {
        const { group: { children }, } = this;
        /* 图案序号，基于最大序号递增 */
        const maxNum = Math.max(...children.map((obj) => obj.layerNum));
        const layerNum = (children.length ? maxNum : 0) + 1;
        /* 建立Img2D对象 */
        const img2D = new Img2D_js_1.Img2D({
            image,
            layerNum,
            name: "图层" + layerNum,
        });
        /* 基于设计尺寸设置图案尺寸 */
        this.setImg2DSize(img2D, 0.5);
        /* 添加图案 */
        this.group.add(img2D);
        /* 选择图案 */
        this.transformControler.obj = img2D;
        return img2D;
    }
    /* 设置图案尺寸 */
    setImg2DSize(img2D, ratio = 1) {
        const { designSize } = this;
        const { width, height } = img2D.image;
        const w = designSize * ratio;
        const h = (w * width) / height;
        img2D.size.set(w, h);
        img2D.offset.set(-w / 2, -h / 2);
    }
    /* 配置设计图 */
    setDesignImg(src) {
        const { designImg, designSize } = this;
        /* 图案尺寸随设计尺寸而定，位置居中 */
        designImg.setOption({
            src,
            size: new Vector2_js_1.Vector2(designSize),
            offset: new Vector2_js_1.Vector2(-designSize / 2),
        });
        /* 渲染 */
        designImg.image.onload = () => {
            this.editorScene.render();
        };
    }
    /* 基于uuid 选择图案 */
    selectImgByUUID(uuid) {
        const { group, transformControler } = this;
        const obj = group.getObjectByProperty("uuid", uuid);
        if (obj instanceof Img2D_js_1.Img2D) {
            transformControler.obj = obj;
        }
    }
    /* 基于图案索引置换图案 */
    replaceImg(a, b) {
        const { group, resultGroup } = this;
        for (let { children } of [group, resultGroup]) {
            [children[a], children[b]] = [children[b], children[a]];
        }
        this.render();
    }
}
exports.Editor = Editor;
