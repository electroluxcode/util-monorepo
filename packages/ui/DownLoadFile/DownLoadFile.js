import { downloadFile } from "./download.js";
document.querySelector("button").addEventListener("click", () => {
    // 根据url下载,但是好像有问题，只有解析不了的才会下载
    downloadFile({
        url: "https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/e08da34488b114bd4c665ba2fa520a31.svg",
        fileName: "image.png",
        type: "svg",
    });
});
