"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagePromises = exports.crtPath = exports.ImagePromise = exports.crtPathByMatrix = void 0;
const Vector2_js_1 = require("../math/Vector2.js");
/**
 * @des 重要:绘制边界
 * 各个边界moveto lineto 后 closepath就好了,如果想要显示出来就需要 stroke
 */
function crtPathByMatrix(ctx, vertices, matrix, closePath = true, isShow = false, style = {
    width: 5, color: "color"
}) {
    // 需要展示的时候的东西 需要 beginpath把数据闭合
    if (isShow) {
        ctx.beginPath();
    }
    const p0 = new Vector2_js_1.Vector2(vertices[0], vertices[1]).applyMatrix3(matrix);
    ctx.moveTo(p0.x, p0.y);
    for (let i = 2, len = vertices.length; i < len; i += 2) {
        const pn = new Vector2_js_1.Vector2(vertices[i], vertices[i + 1]).applyMatrix3(matrix);
        ctx.lineTo(pn.x, pn.y);
    }
    // console.log("zptest:crtPath:",ctx,vertices)
    closePath && ctx.closePath();
    // isShow && ctx.stroke()
    if (isShow) {
        ctx.save();
        ctx.strokeStyle = style.color;
        ctx.lineWidth = style.width;
        ctx.stroke();
        ctx.restore();
        // console.log("stroke-:",isShow,matrix)
    }
    // matrix 不一样 vertices 都是一样的
}
exports.crtPathByMatrix = crtPathByMatrix;
function ImagePromise(image) {
    return new Promise((resolve) => {
        image.onload = () => {
            resolve(image);
        };
    });
}
exports.ImagePromise = ImagePromise;
/* 创建路径 */
function crtPath(ctx, vertices, closePath = false) {
    const p0 = new Vector2_js_1.Vector2(vertices[0], vertices[1]);
    ctx.moveTo(p0.x, p0.y);
    for (let i = 2, len = vertices.length; i < len; i += 2) {
        const pn = new Vector2_js_1.Vector2(vertices[i], vertices[i + 1]);
        ctx.lineTo(pn.x, pn.y);
    }
    closePath && ctx.closePath();
}
exports.crtPath = crtPath;
function ImagePromises(images) {
    return images.map((image) => ImagePromise(image));
}
exports.ImagePromises = ImagePromises;
