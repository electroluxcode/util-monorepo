"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Editor_js_1 = require("./Editor.js");
const Effector_js_1 = require("./Effector.js");
/* 模拟fetch 请求后端图案库数据 */
const patternData = new Promise((resolve) => {
    const arr = [];
    for (let i = 1; i <= 8; i++) {
        arr.push(`https://yxyy-pandora.oss-cn-beijing.aliyuncs.com/stamp-images/${i}.png`);
    }
    resolve(arr);
});
/* 模拟fetch请求后端T恤数据 */
const TShirtData = new Promise((resolve) => {
    resolve({
        /* 设计图 */
        designImgSrc: "https://yxyy-pandora.oss-cn-beijing.aliyuncs.com/stamp-images/design.png",
        /* 效果图素材 */
        effectImgData: [
            {
                src: "",
                globalCompositeOperation: "source-over",
            },
            {
                src: "https://yxyy-pandora.oss-cn-beijing.aliyuncs.com/stamp-images/shirt-mask.png",
                globalCompositeOperation: "destination-in",
            },
            {
                src: "https://yxyy-pandora.oss-cn-beijing.aliyuncs.com/stamp-images/shirt-shadow.png",
                globalCompositeOperation: "multiply",
            },
            // {
            // 	src: '',
            // 	globalCompositeOperation: 'destination-in',
            // },
            // {
            // 	src: 'https://yxyy-pandora.oss-cn-beijing.aliyuncs.com/stamp-images/shirt-origin.jpg',
            // 	globalCompositeOperation: 'destination-over',
            // },
            {
                src: "https://yxyy-pandora.oss-cn-beijing.aliyuncs.com/stamp-images/shirt-noPattern.png",
                globalCompositeOperation: "source-over",
            },
        ],
    });
});
/* 图案库 */
const patternsRef = [];
/* 编辑器的DOMRef */
const editorDomRef = document.querySelector(".operation");
/* 效果图的DOMRef */
const effectDomRef = document.querySelector(".display_top");
/* 图案编辑器 */
const editor = new Editor_js_1.Editor();
const { cursor, transformControler, group: { children }, group, } = editor;
transformControler.on("selected", ({ obj }) => {
    // 更新图层选择状态
    activateLayer(children.length - 1 - children.indexOf(obj));
});
group.on("remove", ({ obj: { uuid } }) => {
    // 删除图层
    removeLayer(uuid);
});
/* 效果图 */
const effector = new Effector_js_1.Effector();
/* 渲染效果图 */
editor.on("render", () => {
    effector.render();
});
/* 图层集合 */
const layersRef = [];
/* 当点击图像库中的图案时，将图案添加到图案编辑器和图层中 */
function addPattern({ target }) {
    if (!(target instanceof Image)) {
        return;
    }
    /* 将图片添加到编辑器中 */
    const { uuid, name } = editor.addImg(target);
    /* 取消当前图层的选择 */
    for (let layer of layersRef) {
        if (layer.active) {
            layer.active = false;
            break;
        }
    }
    /* 添加图像到layersRef中 */
    layersRef.unshift({
        src: target.src,
        active: true,
        uuid,
        name,
    });
}
document.querySelector("img")?.addEventListener("click", addPattern);
/* 选择图层 */
function selectLayer(index) {
    const value = layersRef;
    // 激活图层
    activateLayer(index);
    // 更新图像的控制状态
    editor.selectImgByUUID(value[index].uuid);
}
/* 激活图层 */
function activateLayer(index) {
    const value = layersRef;
    for (let i = 0, len = value.length; i < len; i++) {
        value[i].active = i === index;
    }
}
/* 删除图层 */
function removeLayer(uuid) {
    const value = layersRef;
    for (let i = 0, len = value.length; i < len; i++) {
        if (value[i].uuid === uuid) {
            value.splice(i, 1);
            break;
        }
    }
}
/* 开始拖拽 */
function dragstart({ dataTransfer }, index) {
    dataTransfer && dataTransfer.setData("index", index.toString());
}
/* 置入 */
function drop({ dataTransfer }, index) {
    if (!dataTransfer) {
        return;
    }
    /* 激活图层 */
    const dragIndex = parseInt(dataTransfer.getData("index"));
    activateLayer(dragIndex);
    const value = layersRef;
    /* 选择图层 */
    editor.selectImgByUUID(value[dragIndex].uuid);
    /* 置换图层 */
    [value[dragIndex], value[index]] = [value[index], value[dragIndex]];
    /* 置换图案 */
    const len = value.length - 1;
    editor.replaceImg(len - dragIndex, len - index);
}
/* 图案库 */
// patternData.then((data) => {
// 	patternsRef.value = data;
// });
if (!editorDomRef || !effectDomRef) {
    // return;
}
/* 图案编辑器 */
editor.onMounted(editorDomRef, effectDomRef);
/* 效果图 */
effector.onMounted(effectDomRef);
/* T恤数据 */
TShirtData.then(({ designImgSrc, effectImgData }) => {
    editor.setDesignImg(designImgSrc);
    effector.addImgs(effectImgData, editor.resultScene.canvas);
});
