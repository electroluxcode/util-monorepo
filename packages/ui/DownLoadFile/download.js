import { dataURLtoBlob, imgUrlToBase64 } from "./base64Conver.js";
/**
 * @des 下载图片
 * @param url
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByOnlineUrl(url, filename, mime, bom) {
    imgUrlToBase64(url).then((base64) => {
        downloadByBase64(base64, filename, mime, bom);
    });
}
/**
 * Download pictures based on base64
 * @param buf
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByBase64(buf, filename, mime, bom) {
    const base64Buf = dataURLtoBlob(buf);
    downloadByData(base64Buf, filename, mime, bom);
}
/**
 * @des 根据流进行下载,接口常用
 * @example 下面是接口示例
  export const downTemplate = () => {
    return defHttp.post(
      { url: '/downloadTemplate', responseType: 'blob', },
      { isReturnNativeResponse: true, },
    );
  };
  const res = await subcontractDownloadTemplate();
  downloadByData(
    res.data,
    "测试",
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
  );
 * @param {*} data
 * @param {*} filename
 * @param {*} mime
 * @param {*} bom
 */
export function downloadByData(data, filename, mime, bom) {
    const blobData = typeof bom !== "undefined" ? [bom, data] : [data];
    const blob = new Blob(blobData, { type: mime || "application/octet-stream" });
    const blobURL = window.URL.createObjectURL(blob);
    const tempLink = document.createElement("a");
    tempLink.style.display = "none";
    tempLink.href = blobURL;
    tempLink.setAttribute("download", filename);
    if (typeof tempLink.download === "undefined") {
        tempLink.setAttribute("target", "_blank");
    }
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
}
/**
 * @des 对解析不了的数据进行下载
 * @param {*} sUrl
 */
export function downloadByUnAnalyseUrl({ url, target = "_blank", fileName, }) {
    if (/(iP)/g.test(window.navigator.userAgent)) {
        console.error("Your browser does not support download!");
        return false;
    }
    // 如果设置了filename，那么用第一种策略
    if (fileName) {
        const link = document.createElement("a");
        link.href = url;
        link.target = target;
        if (link.download !== undefined) {
            link.download =
                fileName || url.substring(url.lastIndexOf("/") + 1, url.length);
        }
        if (document.createEvent) {
            const e = document.createEvent("MouseEvents");
            e.initEvent("click", true, true);
            link.dispatchEvent(e);
            return true;
        }
    }
    // 第二种策略
    const feature = [];
    // 防止 tabnapping  攻击(防止资源网站反过来攻击我们，因为打开的界面可以使用window.opener 来篡改数据)
    // refer:https://www.elegantthemes.com/blog/wordpress/rel-noopener-noreferrer-nofollow
    feature.push("noopener=yes");
    feature.push("noreferrer=yes");
    window.open(url, target, feature.join(","));
    return true;
}
/**
 * @des 直接根据url直接下载
 * @param param0
 */
export const downloadFile = ({ type, fileName, url, }) => {
    // 浏览器能够直接解析
    let analyseArr = ["svg", "png", "jpg", "jpeg"];
    if (analyseArr.includes(type)) {
        downloadByOnlineUrl(url, fileName);
    }
    else {
        downloadByUnAnalyseUrl({
            url,
            fileName,
        });
    }
};
